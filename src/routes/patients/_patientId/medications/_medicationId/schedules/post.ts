import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { middleware } from '../../../../../../modules/auth.js';
import { db } from '../../../../../../modules/db.js';
import { Schedule } from '../../../../../../utils/types.js';

// Add a new schedule to the medication of a patient
export default function (endpoint: string, router: Router): Router {
  return router.post(endpoint, middleware, async (req, res) => {
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
