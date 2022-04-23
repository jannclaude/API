import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../index.js';
import { middleware } from '../../../modules/auth.js';

// Delete a single patient
export default function (endpoint: string, router: Router): Router {
  return router.delete(endpoint, middleware, async (req, res) => {
    const result = await db
      .collection('patients')
      .deleteOne({ _id: new ObjectId(req.params.patientId) });

    res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
  });
}
