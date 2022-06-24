import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../modules/db.js';

// Get a single medicine
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, async (req, res) => {
    try {
      const medicine = await db
        .collection('medicines')
        .findOne({ _id: new ObjectId(req.params.medicineId) });

      if (!medicine) return res.sendStatus(404);

      res.json(medicine);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
