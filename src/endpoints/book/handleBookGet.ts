import type DataAccessLayer from '../../db/DataAccessLayer';
import type { Request, Response } from 'express';

export default async function handleBookGet(
  request: Request,
  response: Response,
  dataAccessLayer: DataAccessLayer
) {
  const books = await dataAccessLayer.read('books');

  response.send(books);
}
