const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

let content = '';

app.post('/save', (req, res) => {
  content = req.body.content;
  res.send({ status: 'Content saved successfully' });
});

app.get('/load', (req, res) => {
  res.send({ content });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
