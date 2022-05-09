import express from 'express';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import cors from 'cors';
import fileupload from 'express-fileupload';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import bookRouter from './routes/book';
import wordRouter from './routes/word';
import learnedWordsRouter from './routes/learnedWords';

(async () => {
  await mongoose.connect(
    'mongodb+srv://learn-vocabulary-backend-demo:password_password@cluster0.gglsz.mongodb.net/bookabulary?retryWrites=true&w=majority'
  );

  const app = express();
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowOrigin =
          origin.includes('azurestaticapps') ||
          origin.includes('azurewebsites') ||
          origin.includes('localhost');

        callback(null, allowOrigin);
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    fileupload({
      limits: { fileSize: 1 * 1024 * 1024 * 1024 },
    })
  );
  app.use(
    responseTime((req, res, time) => {
      console.log(req.method, req.url, time + 'ms');
    })
  );

  app.use(authRouter);
  app.use(userRouter);
  app.use(bookRouter);
  app.use(wordRouter);
  app.use(learnedWordsRouter);

  app.listen(8080);
})();
