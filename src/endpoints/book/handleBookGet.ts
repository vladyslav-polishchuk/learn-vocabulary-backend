import fs from 'fs';
import type DataAccessLayer from '../../db/DataAccessLayer';
import type { Request, Response } from 'express';
import getWordsSortedByFrequency from '../../logic';

export default async function handleBookGet(
  request: Request,
  response: Response,
  dataAccessLayer: DataAccessLayer
) {
  const { id } = request.query;

  if (typeof id === 'string') {
    const [book] = await dataAccessLayer.read('books', {
      hash: id,
    });

    fs.readFile(`./uploads/${id}/${(book as any)?.name}`, (err, data) => {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      const words = getWordsSortedByFrequency(data.toString());

      response.send({ words, ...book });
    });
  } else {
    const books = await dataAccessLayer.read('books', {
      //implement books sharing later
      //shared: true
    });
    response.send(books);
  }
}
