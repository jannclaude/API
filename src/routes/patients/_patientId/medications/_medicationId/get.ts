import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Get a single medication of a patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.get(endpoint, async (req, res) => {
    const medication = await db
      .collection('medications')
      .aggregate([
        {
          $match: { _id: new ObjectId(req.params.medicationId) },
        },
        {
          $lookup: {
            from: 'schedules',
            localField: '_id',
            foreignField: 'medication',
            as: 'schedules',
          },
        },
      ])
      .toArray();

    if (medication.length === 0) return res.sendStatus(404);

    res.json(medication[0]);
  });
}
