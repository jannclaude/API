import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../index.js';
import { middleware } from '../../../modules/auth.js';

// Get a single patient
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, async (req, res) => {
    const patient = await db
      .collection('patients')
      .findOne({ _id: new ObjectId(req.params.patientId) });

    if (!patient) return res.sendStatus(404);

    res.json(patient);
  });
}
