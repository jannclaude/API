import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { middleware } from '../../../../modules/auth.js';
import { db } from '../../../../modules/db.js';

// Get all of the medications of a patient
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
