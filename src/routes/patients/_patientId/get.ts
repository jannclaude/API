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
            as: '_medications',
          },
        },
        {
          $lookup: {
            from: 'medicines',
            localField: '_medications.medicine',
            foreignField: '_id',
            as: '_medicines',
          },
        },
        {
          $addFields: {
            medications: {
              $map: {
                input: '$_medications',
                as: 'm',
                in: {
                  $mergeObjects: [
                    '$$m',
                    {
                      name: {
                        $reduce: {
                          input: '$_medicines',
                          initialValue: '',
                          in: {
                            $cond: [
                              {
                                $eq: ['$$this._id', '$$m.medicine'],
                              },
                              '$$this.name',
                              '$$this.value',
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: { _medications: 0, _medicines: 0 },
        },
      ])
      .toArray();

    if (result.length === 0) return res.sendStatus(404);

    res.json(result[0]);
  });
}
