import { mqttPublish } from './mqtt.js';
import { getTimestamp, toSeconds } from '../utils/helpers.js';
import { Command } from '../utils/types.js';

const _commands = new Map<string, Command>();
const _toExecute = [] as Command[];

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
  return {
    command: _toExecute.shift(),
    length: _toExecute.length,
  };
}
