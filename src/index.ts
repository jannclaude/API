import express, { json } from 'express';
import { controllerInit } from './modules/controller.js';
import { connectDb } from './modules/db.js';
import { mqttInit } from './modules/mqtt.js';
import { loadAPIRoutes } from './modules/router.js';

const port = process.env.PORT ?? 3000;
const expressClient = express().use(json());

await connectDb();

expressClient.listen(port, async () => {
  console.log(`Listening on port ${port}.`);

  const routes = await loadAPIRoutes(expressClient);
  console.log(`A total of ${routes} routes were loaded.`);

  mqttInit();
  controllerInit();
});
