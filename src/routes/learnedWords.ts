import express from 'express';
import { verifyToken } from './auth';
import { User } from '../db';

const router = express.Router();

router.post(
  '/word/learned',
  verifyToken,
  async (request: AuthorizedExpressRequest, response: ExpressResponse) => {
    const words: string[] = request.body.words;

    await User.updateOne(request.user, {
      $push: {
        learnedWords: { $each: words },
      },
    });

    response.status(201).send(true);
  }
);

router.delete(
  '/word/learned',
  verifyToken,
  async (request: AuthorizedExpressRequest, response: ExpressResponse) => {
    const words: string[] = request.body.words;

    await User.updateOne(request.user, {
      $pullAll: { learnedWords: words },
    });

    response.status(200).send(true);
  }
);

export default router;
