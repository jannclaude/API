import { ObjectId } from 'mongodb';
import { Container } from './types.js';

export interface BaseCommand {
  id: string;
  type: 'ring' | 'dispense';
  time: number;
  retries: 0;
}

export interface RingCommand extends BaseCommand {
  type: 'ring';
}

export interface DispenseCommand extends BaseCommand {
  type: 'dispense';
  patient: ObjectId;
  medicine: ObjectId;
  medication: ObjectId;
  container: Container;
}
