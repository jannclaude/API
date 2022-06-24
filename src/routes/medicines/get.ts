import { Router } from 'express';
import { db } from '../../modules/db.js';

// Get all medicines
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, async (_, res) => {
    try {
      const medicines = await db.collection('medicines').find().toArray();

      res.json(medicines);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
