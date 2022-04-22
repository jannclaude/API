import express, { json } from 'express';
import { loadAPIRoutes } from './modules/router.js';

const port = process.env.PORT ?? 3000;
const expressClient = express().use(json());

expressClient.listen(port, async () => {
  console.log(`Listening on port ${port}. Loading all routes...`);

  const routes = await loadAPIRoutes(expressClient);

  console.log(`A total of ${routes} routes were loaded.`);
});
