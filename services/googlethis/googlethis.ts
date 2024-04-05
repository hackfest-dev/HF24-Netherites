import { RequestHandler } from 'express';
import googlethis from 'googlethis';
import { googlethisOptions } from './types/googlethis';

export const googleSearch: RequestHandler = async (req, res, next) => {
  try {
    const search = req.query.q as string;
    const options: googlethisOptions = req.body.options;
    const result = await googlethis.search({ query: search, options });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const googleImageSearch: RequestHandler = async (req, res, next) => {
  try {
    const search = req.query.q as string;
    const result = await googlethis.image(search);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
