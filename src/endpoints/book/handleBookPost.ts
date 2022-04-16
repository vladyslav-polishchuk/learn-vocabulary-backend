import getWordsByFrequency from '../../getWordsByFrequency';
import type { Request, Response } from 'express';
import type { UploadedFile } from 'express-fileupload';
import type DataAccessLayer from '../../db/DataAccessLayer';
import type { DbRecord } from '../../db/DataAccessLayer';

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

  if (bookInDb.length) {
    response.send(words);
    return;
  }

  // Do we need await? Maybe can be executed in background
  await dataAccessLayer.create('books', {
    hash: book.md5,
    name: book.name,
    share: false,
    user: null,
  });

  const then = performance.now();
  const wordsFromDb = await dataAccessLayer.read('words');
  console.log('Fetch time:', performance.now() - then);
  console.log('Total words:', wordsFromDb.length);
  console.log(
    'Words with -ing ending:',
    wordsFromDb.filter((word) => (word.value as string).endsWith('ing')).length
  );

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

  response.send(words);
}
