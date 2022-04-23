import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../../index.js';

// Get all of the medications of a patient
export default function (endpoint: string, router: Router): Router {
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
