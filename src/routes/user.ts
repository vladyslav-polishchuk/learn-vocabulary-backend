import express from 'express';
import type DataAccessLayer from '../db/DataAccessLayer';
import type { Request, Response } from 'express';
import { verifyToken } from './auth';

export default function (dataAccessLayer: DataAccessLayer) {
  const router = express.Router();

  router.get(
    '/user/current',
    verifyToken,
    async (request: Request & { user: any }, response: Response) => {
      const user = {
        ...request.user,
        learnedWords: [],
      };

      response.status(200).send(user);
    }
  );

  return router;
}
