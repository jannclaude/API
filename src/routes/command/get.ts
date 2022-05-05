import { Router } from 'express';
import { commandShift } from '../../modules/dispenser.js';

// Get single command
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, (_, res) => {
    res.json(commandShift());
  });
}
