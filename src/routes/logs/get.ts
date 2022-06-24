import { Router } from 'express';
import { middleware } from '../../modules/auth.js';
import { db } from '../../modules/db.js';

// Get single command
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, async (_, res) => {
    try {
      const logs = await db.collection('logs').find().toArray();
      res.json(logs);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
