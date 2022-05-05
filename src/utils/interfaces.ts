import { ObjectId } from 'mongodb';
import { Container } from './types.js';

export interface BaseCommand {
  id: string;
  type: 'ring' | 'dispense';
  time: number;
}

export interface RingCommand extends BaseCommand {
  type: 'ring';
}

export interface DispenseCommand extends BaseCommand {
  type: 'dispense';
  patient: ObjectId;
  medicine: ObjectId;
  container: Container;
}
