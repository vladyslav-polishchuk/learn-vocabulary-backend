import express from 'express';
import cors from 'cors';
import fileupload from 'express-fileupload';
import getDB from './db';
import attachEndpoints from './endpoints';

(async function () {
  const dataAccessLayer = await getDB();

  const app = express();
  app.use(cors());
  app.use(
    fileupload({
      limits: {
        fileSize: 1 * 1024 * 1024 * 1024,
      },
    })
  );
  app.use(express.static('uploads'));

  attachEndpoints(app, dataAccessLayer);

  app.listen(8080);
})();
