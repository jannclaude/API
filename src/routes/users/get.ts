import { Router } from 'express';
import { db } from '../../index.js';

// Get all patients
export default function (endpoint: string, router: Router): Router {
    const users = await db.collection('users').find().toArray();

    res.json(users);
  });
}
