import bcrypt from 'bcrypt';
import { Router } from 'express';
import { authorize } from '../../../modules/auth.js';
import { db } from '../../../modules/db.js';
import { User } from '../../../utils/types.js';

export default function (endpoint: string, router: Router): Router {
  return router.post(endpoint, async (req, res) => {
    const user = await db.collection('users').findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "Email doesn't exist." });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password.' });

    const token = await authorize(user as User);

    const safeUser = { ...user };
    safeUser.password = undefined;
    safeUser.token = token;

    res.json(safeUser);
  });
}
