import { Router } from 'express';
import { Db } from 'mongodb';

// Get all medicines
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.get(endpoint, async (_, res) => {
    const medicines = await db.collection('medicines').find().toArray();

    res.json(medicines);
  });
}
