import mongodb from 'mongodb';

const client = new mongodb.MongoClient(process.env.MONGODB_CONNECTION_STRING!);

export function connectDb() {
  return client.connect();
}

export const db = client.db('medcab');
