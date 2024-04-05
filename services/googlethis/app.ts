import express from 'express';
import { googleImageSearch, googleSearch } from './googlethis';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/search', googleSearch);

app.get('/image', googleImageSearch);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
