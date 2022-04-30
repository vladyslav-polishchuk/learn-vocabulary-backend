import express from 'express';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import cors from 'cors';
import fileupload from 'express-fileupload';
import getDB from './db';
import authRoute from './routes/auth';
import userRoute from './routes/user';
import bookRoute from './routes/book';
import wordRoute from './routes/word';

(async () => {
  const dataAccessLayer = await getDB();

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

  app.use(authRoute(dataAccessLayer));
  app.use(userRoute(dataAccessLayer));
  app.use(bookRoute(dataAccessLayer));
  app.use(wordRoute(dataAccessLayer));

  app.listen(8080);
})();
