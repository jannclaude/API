import express, { json } from 'express';
import mongodb from 'mongodb';
import { loadController } from './modules/controller.js';
import { loadAPIRoutes } from './modules/router.js';

const port = process.env.PORT ?? 3000;
const expressClient = express().use(json());

const client = new mongodb.MongoClient(process.env.MONGODB_CONNECTION_STRING!);

await client.connect();

export const db = client.db('medcab');

expressClient.listen(port, async () => {
  console.log(`Listening on port ${port}.`);

  const routes = await loadAPIRoutes(expressClient);
  console.log(`A total of ${routes} routes were loaded.`);

  loadController();
});
