import { Router } from 'express';
import { forbid, middleware } from '../../../modules/auth.js';

export default function (endpoint: string, router: Router): Router {
  return router.post(endpoint, middleware, async (req, res) => {
    try {
      const token = req.headers.authorization!.split(' ')[1];

      await forbid(token);

      res.sendStatus(200);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
