import bcrypt from 'bcrypt';
import { Router } from 'express';
import { Db } from 'mongodb';

export default function (endpoint: string, router: Router, db: Db): Router {
  return router.post(endpoint, async (req, res) => {
    const collection = await db.collection('users');
    const input = req.body;

    try {
      const person = await collection?.findOne({ email: input.email });

      if (person) {
        const validpassword = await bcrypt.compare(input.password, person.password);

        if (validpassword) {
          return res.status(200).json({ id: person._id, status: 'OK' });
        } else {
          return res.status(400).json({ error: 'Invalid Password' });
        }
      } else {
        res.status(401).json({ error: "Email doesn't exist" });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  });
}
