import { Router } from 'express';
import { db } from '../../../modules/db.js';

// Get container quantity
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, async (req, res) => {
    const container = await db
      .collection('medicines')
      .findOne({ container: parseInt(req.params.num) });
    if (!container) return res.sendStatus(404);

    res.json(container);
  });
}
