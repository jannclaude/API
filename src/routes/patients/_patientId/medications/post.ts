import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../../index.js';
import { Medication } from '../../../../utils/types.js';

// Create a new medication for a patient
export default function (endpoint: string, router: Router): Router {
    const medication: Medication = {
      patient: new ObjectId(req.params.patientId),
      medicine: new ObjectId(req.body.medicine),
    };

    const result = await db.collection('medications').insertOne(medication);
    if (!result.acknowledged) return res.json('Failed to add medication.');

    res.json(result);
  });
}
