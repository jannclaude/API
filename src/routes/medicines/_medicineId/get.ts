import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Get a single medicine
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.get(endpoint, async (req, res) => {
    const medicine = await db
      .collection('medicines')
      .findOne({ _id: new ObjectId(req.params.medicineId) });

    if (!medicine) return res.sendStatus(404);

    res.json(medicine);
  });
}
