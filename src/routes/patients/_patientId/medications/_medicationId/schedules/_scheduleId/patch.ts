import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { middleware } from '../../../../../../../modules/auth.js';
import { db } from '../../../../../../../modules/db.js';

// Update a single schedule from the medication of a patient
export default function (endpoint: string, router: Router): Router {
  return router.patch(endpoint, middleware, async (req, res) => {
    try {
      const result = await db
        .collection('schedules')
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.scheduleId) },
          { $set: req.body },
          { returnDocument: 'after' },
        );

      if (!result.ok || !result.value) return res.sendStatus(404);

      res.json(result.value);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
