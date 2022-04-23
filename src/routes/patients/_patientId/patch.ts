import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../index.js';

// Update a single patient
export default function (endpoint: string, router: Router): Router {
    const result = await db
      .collection('patients')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.patientId) },
        { $set: req.body },
        { returnDocument: 'after' },
      );

    if (!result.ok || !result.value) return res.sendStatus(404);

    res.json(result.value);
  });
}
