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

    const fileName = `./uploads/${id}/${(book as any)?.name}`;
    fs.readFile(fileName, async (err, data) => {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      const words = await getWordsSortedByFrequency(data, fileName);

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
