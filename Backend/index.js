const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors');

// const PORT = 3001;

// app.listen(PORT, () => {
//   console.log('App running on port' + PORT);
// });


let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

// app.use(function(req, res, next) {
//   res.on('finish', () => {
//     console.log(`request url = ${req.originalUrl}`);
//     console.log(res.getHeaders())
//   });
//   next();
// })

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next();
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}




app.use(express.json());
app.use(cors());
app.use(express.static('build'));



// app.use(requestLogger);
// app.use(morgan('tiny'));
morgan.token('body', function (req, res) { 
  if (Object.keys(req.body).length === 0) {
    return '';
  } else {
  return JSON.stringify(req.body) 
  }
});

// app.use(morgan('tiny'))

// app.use(morgan(function (tokens, req, res) {
//   if (tokens.body(req, res)) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens.body(req, res),
//       tokens['response-time'](req, res), 'ms'
//     ].join(' ')
//   } else {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms'
//     ].join(' ')
//   }

// }))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens.body(req, res),
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});

app.get('/info', (request, response) => {
  const num_entries = phonebook.length;
  const time = new Date();
  const entriesHTML = `<p>Phonebook has ${num_entries} entries</p>`
  const br = '<br />'
  const timeHTML = `<p>${time.toString()}</p>`
  response.send(entriesHTML + br + timeHTML)
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  let entry = phonebook.find(entry => entry.id === Number(id));
  if (!entry) {
    console.log('no entry');
    response.status(404).end();
  } else {
    response.status(200).json(entry);
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  let entry = phonebook.find(entry => entry.id === Number(id));
  if (entry) {
    phonebook = phonebook.filter(entry => entry.id !== Number(id))
    response.status(204);
    response.end();
  } else {
    console.log('no entry found to delete')
    response.status(404);
    response.end();
  }
});

const generateRandId = function() {
  let randNum = Math.floor(Math.random() * 10000)
  if (phonebook.some(entry => entry.id === randNum)) {
    return generateRandId()
  } else {
    return randNum;
  }
};

app.post('/api/persons', (request, response) => {
  const name = request.body.name;
  const number = request.body.number;
  if (!name || !number) {
    response.status(404);
    response.send({ error: 'phonebook entry must contain name and number' });
  } else if (phonebook.find(entry => entry.name === name)) {
    response.status(404);
    response.send({ error: 'phonebook entry name must be unique' });
  } else {
    const id = generateRandId();
    const entry = { id, name, number };
    phonebook = phonebook.concat(entry);
    console.log('message from the console')
    response.status(204);
    response.end();
  }

});

app.put('/api/persons/:id', (request, response) => {
  const name = request.body.name;
  const number = request.body.number;
  const id = Number(request.params.id);
  if (!name || !number) {
    response.status(404);
    response.send({ error: 'failed to update due to bad name' });
  } else if (!phonebook.find(entry => entry.name === name)) {
    response.status(404);
    response.send({ error: 'failed to update due to no contact found' });
  } else {
    const updateData = { id, name, number };
    phonebook = phonebook.filter(entry => entry.id !== id);
    phonebook = phonebook.concat(updateData)
    console.log('message from put')
    // console.log('phonebook :>> ', phonebook);
    response.status(204);
    response.end();
  }

});

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});