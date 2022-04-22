import { Router } from 'express';

// Get the status of the API
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, (_, res) => {
    res.json({ status: 'online' });
  });
}
