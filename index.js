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
const PORT = '3004';

// Requisito 1
app.get('/talker', async (req, res) => {
  const palestrant = await fs.readFile(palestrante, 'utf-8').then((data) => data);
    if (palestrant.length > 0) return res.status(200).json(JSON.parse(palestrant));
    return res.status(HTTP_OK_STATUS).json([]);
});

// Requisito 2

app.get('/talker/:id', async (req, res) => {
  const palestrant = await fs.readFile(palestrante, 'utf-8').then((data) => data);
  const { id } = req.params;
  const palestrantesID = palestrant.find((r) => r.id === parseInt(id, 0));
  
  if (!palestrantesID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  return res.status(HTTP_OK_STATUS).json(palestrantesID);
});

// Requisito 3 e 4 

app.post('/login', validateEmailAndPassa, (req, res) => {
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
// colocar em variável um obj que tenha todas as informações 
// fs de escrita jogando a variável 
// para escrever eu posso pegar o array e verificar o tamanho e somar mais 1 no id

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
