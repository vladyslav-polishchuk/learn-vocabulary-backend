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

  if (!bookInDb.length) {
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
      wordsFromDb.filter((word) => (word.value as string).endsWith('ing'))
        .length
    );

    const wordKeyByValue = new Map();
    wordsFromDb.forEach((word) => {
      wordKeyByValue.set(word.value, word);
    });

    const wordsToCreate: DbRecord[] = [];
    const wordsToUpdate: DbRecord[] = [];

    words.map(async (word) => {
      const wordFromDb = wordKeyByValue.get(word.value);
      const count = (wordFromDb?.count ?? 0) + word.count;
      const updatedWord = { ...word, count };

      if (wordFromDb) {
        wordsToUpdate.push({
          ...updatedWord,
          id: wordFromDb.id,
        });
      } else {
        wordsToCreate.push(updatedWord);
      }
    });

    const updatePromises = wordsToUpdate.map(async (word) =>
      dataAccessLayer.update('words', word)
    );

    await Promise.all([
      ...updatePromises,
      dataAccessLayer.create('words', wordsToCreate),
    ]);
  }

  response.send(words);
}
