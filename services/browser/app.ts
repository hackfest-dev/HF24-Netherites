import express, { Request, Response } from 'express';
import cors from 'cors';

import {
  launchBrowser,
  createBrowserContext,
  getPage,
  releasePage,
} from './playwright';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

launchBrowser().then(() => {
  console.log('Browser launched');
  createBrowserContext().then(() => {
    console.log('Browser context created');
  });
});

app.post('/', async (req: Request, res: Response) => {
  const url = req.body.url;
  const timeout = req.body.timeout || 10;

  try {
    const page = await getPage(timeout);

    if (!page?.page) {
      res.status(500).send('No page available');
      return;
    }

    await page.page.goto(url);
    const html = await page.page.content();
    releasePage(page);
    res.json({ html });
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
