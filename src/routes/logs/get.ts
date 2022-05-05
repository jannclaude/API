import { Router } from 'express';
import { db } from '../../modules/db.js';

// Get single command
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, async (_, res) => {
    const logs = await db.collection('logs').find().toArray();
    res.json(logs);
  });
}
