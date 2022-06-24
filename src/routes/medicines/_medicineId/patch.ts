import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../modules/db.js';

// Update a single medicine
export default function (endpoint: string, router: Router): Router {
  return router.patch(endpoint, async (req, res) => {
    try {
      const result = await db
        .collection('medicines')
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.medicineId) },
          { $set: req.body },
          { returnDocument: 'after' },
        );

      if (!result.ok || !result.value) return res.sendStatus(404);

      res.json(result.value);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
