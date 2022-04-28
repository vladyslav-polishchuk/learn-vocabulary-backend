import type DataAccessLayer from '../db/DataAccessLayer';
import type { Request, Response } from 'express';

export const handleWordGet = async function (
  request: Request,
  response: Response,
  dataAccessLayer: DataAccessLayer
) {
  const words = await dataAccessLayer.read('words', {}, { count: 'desc' });

  response.send(words);
};
