import { Router } from 'express';

// Get the status of the API
export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, (_, res) => {
    try {
      res.json({ status: 'online' });
    } catch (error) {
      res.status(500).json(error);
    }
  });
}
