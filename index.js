const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const validateEmailAndPassa = require('./validations/validateEmailAndPassa');
const { 
  validateToken,
  validationName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validadeRate, 
} = require('./validations/validateToken');

const palestrante = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// Requisito 1
app.get('/talker', async (req, res) => {
  const palestrant = await fs.readFile(palestrante, 'utf-8').then((data) => data);
    if (palestrant.length > 0) return res.status(200).json(JSON.parse(palestrant));
    return res.status(HTTP_OK_STATUS).json([]);
});

// Requisito 2

app.get('/talker/:id', async (req, res) => {
  const doc = await fs.readFile(palestrante, 'utf-8').then((data) => data);
  const palestrant = JSON.parse(doc);
  const { id } = req.params;
  const palestrantesID = palestrant.find((r) => r.id === parseInt(id, 0));
  
  if (!palestrantesID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  return res.status(HTTP_OK_STATUS).json(palestrantesID);
});

// Requisito 3 e 4 

app.post('/login', validateEmailAndPassa, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(HTTP_OK_STATUS).json({ token });
});

// Requisito 5

app.post('/talker',
  validateToken,
  validationName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validadeRate,
  async (req, res) => {  
  const doc = await fs.readFile(palestrante, 'utf-8').then((data) => data);
  const palestrant = JSON.parse(doc);
  const { name, age, talk } = req.body;
  const obj = {
    name,
    age,
    id: palestrant.length + 1,
    talk,
  };
  const palestrants = [...palestrant, obj];
  await fs.writeFile(palestrante, JSON.stringify(palestrants));
  return res.status(201).json(obj);
});

// Requisito 6

app.put('/talker/:id',
  validateToken,
  validationName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validadeRate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const newObj = { name, age, talk, id: Number(id) };
  const doc = await fs.readFile(palestrante, 'utf-8').then((data) => data);
  const palestrant = JSON.parse(doc);
  const takId = palestrant.find((r) => r.id === parseInt(id, 0));  
  if (!takId) return res.status(404).json({ message: 'Recipe not found!' });
  const newArray = [palestrant[takId] = { ...palestrant[takId], name, age, talk, id: Number(id) }];
  await fs.writeFile(palestrante, JSON.stringify(newArray));

  res.status(200).json(newObj);
});

// Requisito 7

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const doc = await fs.readFile(palestrante, 'utf-8').then((data) => data);
  const palestrant = JSON.parse(doc);
  const takId = palestrant.find((r) => r.id === parseInt(id, 0));
  if (takId === -1) return res.status(404).json({ message: 'Recipe not found!' });
  await fs.writeFile(palestrante, JSON.stringify(palestrant.splice(takId, 1)));
  res.status(204).end();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
