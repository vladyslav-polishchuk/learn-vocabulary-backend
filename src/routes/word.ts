import express from 'express';
import type { Request, Response } from 'express';
import { Word } from '../db';

const router = express.Router();

router.get('/word', async (request: Request, response: Response) => {
  const words = await Word.find({}).sort({ count: -1 }).select({ _id: 0 });

  response.send(words);
});

export default router;
