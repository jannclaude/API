import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../../../../../index.js';

// Update a single schedule from the medication of a patient
export default function (endpoint: string, router: Router): Router {
    const result = await db
      .collection('schedules')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.scheduleId) },
        { $set: req.body },
        { returnDocument: 'after' },
      );

    if (!result.ok || !result.value) return res.sendStatus(404);

    res.json(result.value);
  });
}
