import { Router } from 'express';
import { middleware } from '../../modules/auth.js';
import { db } from '../../modules/db.js';

// Get all patients
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, async (_, res) => {
    const users = await db.collection('users').find().toArray();

    res.json(users);
  });
}
