import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Update a single schedule from the medication of a patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.patch(endpoint, async (req, res) => {
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
