const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended:true }));

app.use(bodyParser.json());

app.listen(8000, 'localhost', () => {
  console.log('loading please wait');
});