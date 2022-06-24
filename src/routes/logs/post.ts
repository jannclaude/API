import { Router } from 'express';
import { middleware } from '../../modules/auth.js';
import { logDispense } from '../../modules/dispenser.js';

// Get single command
export default function (endpoint: string, router: Router): Router {
  return router.post(endpoint, middleware, async (req, res) => {
    try {
      await logDispense(req.body.id, req.body.status);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
