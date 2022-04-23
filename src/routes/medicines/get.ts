import { Router } from 'express';
import { db } from '../../index.js';

// Get all medicines
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, async (_, res) => {
    const medicines = await db.collection('medicines').find().toArray();

    res.json(medicines);
  });
}
