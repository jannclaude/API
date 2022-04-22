import { Router } from 'express';
import { Db } from 'mongodb';

// Get all patients
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.get(endpoint, async (_, res) => {
    const patients = await db.collection('patients').find().toArray();

    res.json(patients);
  });
}
