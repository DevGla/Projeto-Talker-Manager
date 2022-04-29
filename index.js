const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fs = require('fs');
const validateEmailAndPassa = require('./validations/validateEmailAndPassa');

const palestrante = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// Requisito 1
app.get('/talker', (req, res) => {
  const palestrant = fs.readFileSync(palestrante, 'utf-8');
    if (palestrant.length > 0) return res.status(200).json(JSON.parse(palestrant));
    return res.status(200).json([]);
});

// Requisito 2

app.get('/talker/:id', (req, res) => {
  const palestrant = JSON.parse(fs.readFileSync(palestrante, 'utf-8'));
  const { id } = req.params;
  const palestrantesID = palestrant.find((r) => r.id === parseInt(id, 0));
  
  if (!palestrantesID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  return res.status(200).json(palestrantesID);
});

// Requisito 3

app.post('/login', validateEmailAndPassa, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
