const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fs = require('fs');
const palestrantes = require('./talker.json');

const palestrante = './talker.json';
try {
  const data = fs.readFileSunc(JSON.parse(palestrante), 'utf8');
  console.log(data);
} catch (err) {
  console.error(`Erro ao ler o arquivo: ${err.path}`);
  console.log(err);
}

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3002';

// Requisito 1
app.get('/talker', (req, res) => {
  if (palestrantes.length === 0) return res.status(HTTP_OK_STATUS).json([]);
  return res.status(HTTP_OK_STATUS).json(palestrantes);
});

// Requisito 2

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const palestrantesID = palestrantes.find((r) => r.id === parseInt(id, 0));
  
  if (!palestrantesID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  return res.status(200).json(palestrantesID);
});

// Requisito 3
const validEmailAndPass = [];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  validEmailAndPass.push({ email, password });
  console.log(validEmailAndPass);
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
