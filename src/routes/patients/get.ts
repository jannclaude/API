import { Router } from 'express';
import { db } from '../../index.js';
import { Db } from 'mongodb';

// Get all patients
export default function (endpoint: string, router: Router): Router {
    const patients = await db.collection('patients').find().toArray();

    res.json(patients);
  });
}
