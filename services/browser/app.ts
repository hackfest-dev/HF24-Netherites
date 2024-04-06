import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import {
  launchBrowser,
  createBrowserContext,
  getPage,
  releasePage,
} from './playwright';

import { getText } from './utils';

const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

launchBrowser().then(() => {
  console.log('Browser launched');
  createBrowserContext().then(() => {
    console.log('Browser context created');
  });
});

app.post('/static', async (req: Request, res: Response) => {
  const { url } = req.body;

  try {
    const response = await fetch(url);
    const html = await response.text();
    res.json({ html });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
});

app.post('/', async (req: Request, res: Response) => {
  const { url, timeout = 10, html, text } = req.body;

  try {
    const page = await getPage(timeout);

    if (!page?.page) {
      res.status(500).send('No page available');
      return;
    }

    await page.page.goto(url);
    const HTML = await page.page.content();
    releasePage(page);
    const TEXT = getText(HTML);
    let response = {};

    if (html === 'true') {
      response = { ...response, HTML };
    }
    if (text === 'true') {
      response = { ...response, TEXT };
    }

    res.json(response);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
