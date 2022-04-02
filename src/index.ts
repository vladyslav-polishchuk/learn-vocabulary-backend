import express from 'express';

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
