import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Update a single medicine
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.patch(endpoint, async (req, res) => {
    const result = await db
      .collection('medicines')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.medicineId) },
        { $set: req.body },
        { returnDocument: 'after' },
      );

    if (!result.ok || !result.value) return res.sendStatus(404);

    res.json(result.value);
  });
}
