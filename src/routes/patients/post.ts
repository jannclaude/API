import { Router } from 'express';
import { db } from '../../index.js';
import { Patient } from '../../utils/types.js';

// Add a new patient
export default function (endpoint: string, router: Router): Router {
    const patient: Patient = {
      name: req.body.name,
      age: req.body.age,
    };

    const result = await db.collection('patients').insertOne(patient);
    if (!result.acknowledged) return res.json('Failed to add patient.');

    res.json(patient);
  });
}
