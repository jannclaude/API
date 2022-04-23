import bcrypt from 'bcrypt';
import { Router } from 'express';
import { Db } from 'mongodb';
import { User } from '../../utils/users-types.js';

export default function (endpoint: string, router: Router, db: Db): Router {
  return router.post(endpoint, async (req, res) => {
    const user: User = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    const result = await db.collection('users').insertOne(user);
    if (!result.acknowledged) return res.json('Failed to add user.');

    res.json(user);
  });
}
