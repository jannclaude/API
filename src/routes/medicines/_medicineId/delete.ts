import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../index.js';

// Delete a single medicine
export default function (endpoint: string, router: Router): Router {
  return router.delete(endpoint, async (req, res) => {
    const result = await db
      .collection('medicines')
      .deleteOne({ _id: new ObjectId(req.params.medicineId) });

    res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
  });
}
