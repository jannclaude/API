import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../index.js';
import { middleware } from '../../../modules/auth.js';

// Get a single patient
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, async (req, res) => {
    const result = await db
      .collection('patients')
      .aggregate([
        {
          $match: {
            _id: new ObjectId(req.params.patientId),
          },
        },
        {
          $lookup: {
            from: 'medications',
            localField: '_id',
            foreignField: 'patient',
            as: 'medications',
          },
        },
        {
          $unwind: '$medications',
        },
        {
          $lookup: {
            from: 'medicines',
            localField: 'medications.medicine',
            foreignField: '_id',
            as: 'medications.medicine',
          },
        },
        {
          $set: {
            'medications.medicine': { $arrayElemAt: ['$medications.medicine', 0] },
          },
        },
      ])
      .toArray();

    if (result.length === 0) return res.sendStatus(404);

    res.json(result[0]);
  });
}
