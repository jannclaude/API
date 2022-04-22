import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Get a single patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.get(endpoint, async (req, res) => {
    const patient = await db
      .collection('patients')
      .findOne({ _id: new ObjectId(req.params.patientId) });

    if (!patient) return res.sendStatus(404);

    res.json(patient);
  });
}
