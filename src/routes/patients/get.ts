import { Router } from 'express';
import { db } from '../../index.js';
import { middleware } from '../../modules/auth.js';

// Get all patients
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, async (_, res) => {
    const patients = await db.collection('patients').find().toArray();

    res.json(patients);
  });
}
