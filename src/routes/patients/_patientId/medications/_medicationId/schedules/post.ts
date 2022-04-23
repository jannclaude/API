import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';
import { Schedule } from '../../../../../../utils/types.js';

// Add a new schedule to the medication of a patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.post(endpoint, async (req, res) => {
    const schedule: Schedule = {
      medication: new ObjectId(req.params.medicationId),
      days: req.body.days,
      time: req.body.time,
    };

    const result = await db.collection('schedules').insertOne(schedule);
    if (!result.acknowledged) return res.json('Failed to add schedule.');

    res.json(result);
  });
}
