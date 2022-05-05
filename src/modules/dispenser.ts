import { ObjectId } from 'mongodb';
import { db } from './db.js';
import { mqttPublish } from './mqtt.js';
import { getTimestamp, toDate, toSeconds } from '../utils/helpers.js';
import { Command, DispenseStatus, Log } from '../utils/types.js';

const _commands = new Map<string, Command>();
const _toExecute = [] as Command[];
const _executed = new Map<string, Command>();

export function loadDispenser(): void {
  processCommands();
  setInterval(processCommands, 1000);
}

export function queueCommand(command: Command): void {
  _commands.set(command.id, command);
  console.log(`Command set: ${command.id}`);
}

export function deleteCommand(commandId: string): void {
  _commands.delete(commandId);
}

export function processCommands(): void {
  const now = toSeconds(getTimestamp());
  let toExecute = [..._commands.values()]
    .filter(command => command.time <= now)
    .sort((a, b) => a.time - b.time);

  if (toExecute.length > 0) {
    // Ring
    toExecute = [{ id: '_ring', type: 'ring', time: now, retries: 0 }, ...toExecute];
  }

  for (const command of toExecute) {
    const notify = _toExecute.length === 0;
    _toExecute.push(command);
    if (notify) mqttPublish('MedCab-Container-RRC', 'New Command');
  }
}

export function commandShift(): { command: Command | undefined; length: number } {
  const command = _toExecute.shift();
  const length = _toExecute.length;

  if (command) _executed.set(command.id, command);

  return { command, length };
}

export async function logDispense(id: string, status: DispenseStatus): Promise<void> {
  const commmand = _executed.get(id);
  if (!commmand) return;

  const medication = await db.collection('medication').findOne({ _id: new ObjectId(id) });
  if (!medication) return;

  const patient = await db.collection('patient').findOne({ _id: new ObjectId(medication.patient) });
  if (!patient) return;

  const medicine = await db
    .collection('medicine')
    .findOne({ _id: new ObjectId(medication.medicine) });
  if (!medicine) return;

  const schedule = await db.collection('schedule').findOne({ medication: medication._id });
  if (!schedule) return;

  const log: Log = {
    patientId: medication.patient,
    medicineName: medicine.name,
    schedule: toDate(schedule.time),
    status: status,
  };

  await db.collection('logs').insertOne(log);
}
