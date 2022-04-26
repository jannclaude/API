import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { middleware } from '../../../modules/auth.js';
import { db } from '../../../modules/db.js';

// Update a single patient
export default function (endpoint: string, router: Router): Router {
  return router.patch(endpoint, middleware, async (req, res) => {
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
