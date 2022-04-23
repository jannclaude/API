import { Router } from 'express';
import { db } from '../../index.js';
import { middleware } from '../../modules/auth.js';
import { Patient } from '../../utils/types.js';

// Add a new patient
export default function (endpoint: string, router: Router): Router {
  return router.post(endpoint, middleware, async (req, res) => {
    const patient: Patient = {
      name: req.body.name,
      age: req.body.age,
    };

    const result = await db.collection('patients').insertOne(patient);
    if (!result.acknowledged) return res.json('Failed to add patient.');

    res.json(patient);
  });
}
