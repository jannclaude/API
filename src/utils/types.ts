import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { DispenseCommand, RingCommand } from './interfaces.js';

export interface APIRoute {
  (endpoint: string, router: Router): Router;
}

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const Days = [
  '',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as Day[];

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
  time: number;
};

export type Medicine = {
  _id?: ObjectId;
  name: string;
  quantity: number;
  container: Container;
};

export type User = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
};

export type AccessToken = {
  _id: ObjectId;
  user: ObjectId;
  token: string;
};

export type Command = RingCommand | DispenseCommand;

export type DispenseStatus = 'Success' | 'Failed';

export type Log = {
  medicationId: ObjectId;
  patientId: ObjectId;
  patientName: string;
  medicineId: ObjectId;
  medicineName: string;
  schedule: Date;
  status: DispenseStatus;
};
