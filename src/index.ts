import express from 'express';
import responseTime from 'response-time';
import cors from 'cors';
import fileupload from 'express-fileupload';
import getDB from './db';
import authRoute from './routes/auth';
import bookRoute from './routes/book';
import wordRoute from './routes/word';

(async function () {
  const dataAccessLayer = await getDB();

  const app = express();
  app.use(cors());
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
  app.use(bookRoute(dataAccessLayer));
  app.use(wordRoute(dataAccessLayer));

  app.listen(8080);
})();
