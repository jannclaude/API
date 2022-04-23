import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

export interface APIRoute {
  (endpoint: string, router: Router, db: Db): Router;
}

export type User = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
};
