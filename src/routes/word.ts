import express from 'express';
import { Word } from '../db';

const router = express.Router();

router.get('/word', async (request, response: ExpressResponse) => {
  const words = await Word.find({}).sort({ count: -1 }).select({ _id: 0 });

  response.send(words);
});

export default router;
