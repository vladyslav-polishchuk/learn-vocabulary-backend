import express from 'express';
import getDB from './db';

getDB().then((db) => console.log(db));

const app = express();
app.get('/', (request, response) => {
  const html = `
    <!DOCTYPE html>
      <html lang = 'en'>
        <head>
          <title>Test!</title>
        </head>
        <body>posts.map (function (post) {return " <li>" + post.title + "</li>";}). join ("")
        </body>
      </html>
	`;
  response.send(html);
});

app.listen(8080);
