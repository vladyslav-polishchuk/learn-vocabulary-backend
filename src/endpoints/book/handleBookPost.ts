import fs from 'fs';
import type { Request, Response } from 'express';
import type { UploadedFile } from 'express-fileupload';
import getWordsSortedByFrequency from '../../logic';
import type DataAccessLayer from '../../db/DataAccessLayer';
import type { DbRecord } from '../../db/DataAccessLayer';

export default async function handleBookPost(
  request: Request,
  response: Response,
  dataAccessLayer: DataAccessLayer
) {
  const bookFile = request.files.book as UploadedFile;
  const words = await getWordsSortedByFrequency(bookFile.data, bookFile.name);
  const bookInDb = await dataAccessLayer.read('books', {
    hash: bookFile.md5,
  });
  const book = {
    hash: bookFile.md5,
    name: bookFile.name,
    share: false,
  };

  if (bookInDb.length) {
    response.send({ words, ...book });
    return;
  }

  const fileDirectory = `./uploads/${bookFile.md5}`;
  fs.mkdir(fileDirectory, { recursive: true }, async (err) => {
    if (err) {
      console.log('File was not saved', err);
    } else {
      await bookFile.mv(`${fileDirectory}/${bookFile.name}`);
    }
  });

  await dataAccessLayer.create('books', book);

  const wordsFromDb = await dataAccessLayer.read('words');
  const wordKeyByValue = new Map();
  wordsFromDb.forEach((word) => {
    wordKeyByValue.set(word.value, word);
  });

  await dataAccessLayer.transaction(async () => {
    for (const word of words) {
      const wordFromDb = wordKeyByValue.get(word.value);
      if (!wordFromDb) {
        await dataAccessLayer.create('words', word as unknown as DbRecord);
        continue;
      }

      const count = wordFromDb.count + word.count;
      await dataAccessLayer.update('words', {
        ...wordFromDb,
        count,
      });
    }
  });

  response.send({ words, ...book });
}
