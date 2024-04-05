import express from 'express';
import { googleSearch } from './googlethis';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/search', googleSearch);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
