import { Router } from 'express';
import { middleware } from '../../modules/auth.js';
import { db } from '../../modules/db.js';
import { Patient } from '../../utils/types.js';

// Add a new patient
export default function (endpoint: string, router: Router): Router {
  return router.post(endpoint, middleware, async (req, res) => {
    try {
      const patient: Patient = {
        name: req.body.name,
        age: req.body.age,
      };

      const result = await db.collection('patients').insertOne(patient);
      if (!result.acknowledged) return res.json('Failed to add patient.');

      res.json(patient);
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
