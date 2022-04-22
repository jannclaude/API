import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Get all of the medications of a patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.get(endpoint, async (req, res) => {
    const medications = await db
      .collection('medications')
      .aggregate([
        {
          $match: {
            patient: new ObjectId(req.params.patientId),
          },
        },
        {
          $lookup: {
            from: 'medicines',
            localField: 'medicine',
            foreignField: '_id',
            as: 'medicines',
          },
        },
        {
          $set: {
            medicine: { $arrayElemAt: ['$medicines', 0] },
          },
        },
        { $project: { medicines: 0 } },
      ])
      .toArray();

    res.json(medications);
  });
}
