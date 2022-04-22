import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

export interface APIRoute {
  (endpoint: string, router: Router, db: Db): Router;
}

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type Container = 1 | 2 | 3 | 4 | 5;

export type Patient = {
  _id?: ObjectId;
  name: string;
  age: number;
};

export type Medication = {
  _id?: ObjectId;
  patient: ObjectId;
  medicine: ObjectId;
};

export type Schedule = {
  _id?: ObjectId;
  medication: ObjectId;
  days: Day[];
  time: string;
};

export type Medicine = {
  _id?: ObjectId;
  name: string;
  quantity: number;
  container: Container;
};
