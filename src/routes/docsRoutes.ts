import { Router } from 'express';

export const docsRoutes = Router();

docsRoutes.get('/', (_req, res) => {
  res.json({ message: 'API Documentation' });
});
