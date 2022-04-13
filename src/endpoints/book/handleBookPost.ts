import getWordsByFrequency from '../../getWordsByFrequency';
import type { Request, Response } from 'express';
import type { UploadedFile } from 'express-fileupload';
import type DataAccessLayer from '../../db/DataAccessLayer';

export default async function handleBookPost(
  request: Request,
  response: Response,
  dataAccessLayer: DataAccessLayer
) {
  const book = request.files.book as UploadedFile;
  const words = getWordsByFrequency(book);

  const bookInDb = await dataAccessLayer.read('books', {
    hash: book.md5,
  });
  if (!bookInDb.length) {
    // Do we need await? Maybe can be executed in background
    await dataAccessLayer.create('books', {
      hash: book.md5,
      name: book.name,
      share: false,
      user: null,
    });

    const wordsFromDb = await dataAccessLayer.read('words');
    const wordKeyByValue = new Map();
    wordsFromDb.forEach((word) => {
      wordKeyByValue.set(word.value, word);
    });

    const promises = words.map(async (word) => {
      const wordFromDb = wordKeyByValue.get(word.value);
      const count = (wordFromDb?.count ?? 0) + word.count;
      const updatedWord = { ...word, count };

      if (wordFromDb) {
        await dataAccessLayer.update('words', {
          ...updatedWord,
          id: wordFromDb.id,
        });
      } else {
        await dataAccessLayer.create('words', updatedWord);
      }
    });

    await Promise.all(promises);
  }

  response.send(words);
}
