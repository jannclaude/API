import { Router } from 'express';
import { Db } from 'mongodb';
import { Medicine } from '../../utils/types.js';

// Add a new medicine
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.post(endpoint, async (req, res) => {
    const medicine: Medicine = {
      name: req.body.name,
      container: req.body.container,
      quantity: req.body.quantity,
    };

    const result = await db.collection('medicines').insertOne(medicine);
    if (!result.acknowledged) return res.json('Failed to add medicine.');

    res.json(medicine);
  });
}
