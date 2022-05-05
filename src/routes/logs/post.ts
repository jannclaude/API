import { Router } from 'express';
import { logDispense } from '../../modules/dispenser.js';

// Get single command
export default function (endpoint: string, router: Router): Router {
  return router.post(endpoint, async (req, res) => {
    await logDispense(req.body.id, req.body.status);
    res.sendStatus(200);
  });
}
