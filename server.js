const express = require('express');
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
const api = require('./routes/index.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



app.use('/api', api);

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);