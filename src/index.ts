import express from 'express';
import cors from 'cors';
import fileupload from 'express-fileupload';
import getDB from './db';
import attachEndpoints from './endpoints';

(async function () {
  const dataAccessLayer = await getDB();

  const app = express();
  app.use(cors());
  app.use(fileupload());

  attachEndpoints(app, dataAccessLayer);

  app.listen(8080);
})();
