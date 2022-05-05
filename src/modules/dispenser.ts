import { ObjectId } from 'mongodb';
import { db } from './db.js';
import { mqttPublish } from './mqtt.js';
import { getTimestamp, toDate, toSeconds } from '../utils/helpers.js';
import { Command, DispenseStatus, Log } from '../utils/types.js';

const _commands = new Map<string, Command>();
const _toExecute = [] as string[];
const _executed = new Map<string, Command>();

const ringCommand: Command = { id: '_ring', type: 'ring', time: 0 };

export function loadDispenser(): void {
  processCommands();
  setInterval(processCommands, 5000);
}

export function queueCommand(command: Command): void {
  _commands.set(command.id, command);
  console.log(`Command set: ${command.id}`);
}

export function deleteCommand(commandId: string): void {
  _commands.delete(commandId);
}

export async function processCommands(): Promise<void> {
  const now = toSeconds(getTimestamp());
  let toExecute = [..._commands.values()]
    .filter(command => command.time <= now && !_toExecute.includes(command.id))
    .sort((a, b) => a.time - b.time);

  if (toExecute.length > 0) {
    // Ring
    toExecute = [ringCommand, ...toExecute];
  }

  for (const command of toExecute) {
    const notify = _toExecute.length === 0;
    _toExecute.push(command.id);
    if (notify) await mqttPublish('MedCabCommandsRRC', 'New Command');
  }

  console.log({ _commands, _toExecute, _executed });
}

export function commandShift(): { command: Command | undefined; length: number } {
  const commandId = _toExecute.shift();
  const length = _toExecute.length;
  if (!commandId) return { command: undefined, length };

  if (commandId === '_ring') {
    return { command: ringCommand, length };
  }

  const command = _commands.get(commandId);

  _commands.delete(commandId);

  console.log({ command, length });

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
