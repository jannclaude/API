import { Router } from 'express';
import { Db } from 'mongodb';
import { Patient } from '../../utils/types.js';

// Add a new patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.post(endpoint, async (req, res) => {
    const patient: Patient = {
      name: req.body.name,
      age: req.body.age,
    };

    const result = await db.collection('patients').insertOne(patient);
    if (!result.acknowledged) return res.json('Failed to add patient.');

    res.json(patient);
  });
}
