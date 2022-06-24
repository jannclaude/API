import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { middleware } from '../../../../../../../modules/auth.js';
import { db } from '../../../../../../../modules/db.js';

// Delete a single schedule from a medication of a patient
export default function (endpoint: string, router: Router): Router {
  return router.delete(endpoint, middleware, async (req, res) => {
    try {
      const result = await db
        .collection('schedules')
        .deleteOne({ _id: new ObjectId(req.params.scheduleId) });

      res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
