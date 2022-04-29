import express from 'express';
import type DataAccessLayer from '../db/DataAccessLayer';
import type { Request, Response } from 'express';

export default function (dataAccessLayer: DataAccessLayer) {
  const router = express.Router();

  router.get('/word', async (request: Request, response: Response) => {
    const words = await dataAccessLayer.read('words', {}, { count: 'desc' });

    response.send(words);
  });

  return router;
}
