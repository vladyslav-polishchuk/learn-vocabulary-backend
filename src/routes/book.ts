import express from 'express';
import getWordsSortedByFrequency from '../logic';
import { verifyToken } from './auth';
import type { Request, Response } from 'express';
import type { UploadedFile } from 'express-fileupload';
import { Book, Word } from '../db';

const router = express.Router();

router.get('/book', async (request: Request, response: Response) => {
  const { id } = request.query;
  if (typeof id !== 'string') {
    const books = await Book.find({}).select({ _id: 0, words: 0, __v: 0 });
    return response.send(books);
  }

  const book = await Book.findOne({ hash: id });
  if (!book) {
    return response.status(404);
  }

  book.views++;
  book.save();

  response.send(book);
});

router.post(
  '/book',
  verifyToken,
  async (request: Request, response: Response) => {
    const bookFile = request.files.book as UploadedFile;
    const words = await getWordsSortedByFrequency(bookFile.data, bookFile.name);
    const bookInDb = await Book.findOne({
      hash: bookFile.md5,
    });

    if (bookInDb) {
      return response.send(bookInDb);
    }

    const newBook = new Book({
      hash: bookFile.md5,
      name: bookFile.name,
      views: 0,
      words,
    });
    newBook.save();

    const wordsFromDb = await Word.find({}).select({ _id: 0 });
    const wordKeyByValue = new Map();
    wordsFromDb.forEach((word: any) => {
      wordKeyByValue.set(word.value, word);
    });

    Word.bulkWrite(
      words.map((word) => ({
        updateOne: {
          filter: { value: word.value },
          update: {
            $set: {
              ...word,
              count: word.count + (wordKeyByValue.get(word.value)?.count ?? 0),
            },
          },
          upsert: true,
        },
      }))
    );

    response.send(newBook);
  }
);

export default router;
