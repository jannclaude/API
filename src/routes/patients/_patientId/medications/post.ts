import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';
import { Medication } from '../../../../utils/types.js';

// Create a new medication for a patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.post(endpoint, async (req, res) => {
    const medication: Medication = {
      patient: new ObjectId(req.params.patientId),
      medicine: new ObjectId(req.body.medicine),
    };

    const result = await db.collection('medications').insertOne(medication);
    if (!result.acknowledged) return res.json('Failed to add medication.');

    res.json(result);
  });
}
