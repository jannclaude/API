import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../../../../index.js';
import { Schedule } from '../../../../../../utils/types.js';

// Add a new schedule to the medication of a patient
export default function (endpoint: string, router: Router): Router {
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
