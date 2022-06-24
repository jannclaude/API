import { Router } from 'express';
import { middleware } from '../../modules/auth.js';
import { db } from '../../modules/db.js';

// Get containers
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, async (_, res) => {
    try {
      const containers = await db.collection('medicines').find().sort('container').toArray();

      res.json(containers);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
