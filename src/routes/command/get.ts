import { Router } from 'express';
import { middleware } from '../../modules/auth.js';
import { commandShift } from '../../modules/dispenser.js';

// Get single command
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, middleware, (_, res) => {
    res.json(commandShift());
  });
}
