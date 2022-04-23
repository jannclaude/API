import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../../../index.js';
import { middleware } from '../../../../../modules/auth.js';

// Delete a single medication of a patient
export default function (endpoint: string, router: Router): Router {
  return router.delete(endpoint, middleware, async (req, res) => {
    const result = await db
      .collection('medications')
      .deleteOne({ _id: new ObjectId(req.params.medicationId) });

    res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
  });
}
