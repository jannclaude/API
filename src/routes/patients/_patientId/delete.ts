import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../index.js';

// Delete a single patient
export default function (endpoint: string, router: Router): Router {
    const result = await db
      .collection('patients')
      .deleteOne({ _id: new ObjectId(req.params.patientId) });

    res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
  });
}
