import { Router } from 'express';

export default function (endpoint: string, router: Router): Router {
  return router.get(endpoint, async (_, res) => {
    await res.json({ status: 'online' });
  });
}
