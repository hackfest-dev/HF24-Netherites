import express from 'express';

const app = express();

app.use(express.json());

const GOOGLE_BASE_URL = 'http://localhost:5000';

app.get('/competitor', (req, res) => {
  try {
    const company_name = req.query.company_name;
    const interval = req.query.interval;

    
    fetch(GOOGLE_BASE_URL + '/search?q=' + company_name, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        options: {
          safe: true,
          params: {
            inurl: 'vs',
            intitle: company_name,
            intext: 'competitor',
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;

        res.status(200).json(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.listen(5004, () => {
  console.log('Server is running on port 5000');
});
