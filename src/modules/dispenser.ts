import { mqttPublish } from './mqtt.js';
import { getTimestamp, toSeconds } from '../utils/helpers.js';
import { Queuer } from '../utils/queuer.js';
import { Command } from '../utils/types.js';

const _commands = new Map<string, Command>();
const _queuer = new Queuer();

export function loadDispenser(): void {
  processCommands();
  setInterval(processCommands, 1000);
}

export function queueCommand(command: Command): void {
  if (_commands.has(command.id)) return;
  _commands.set(command.id, command);
  console.log(`Command set: ${command.id}`);
}

export function deleteCommand(commandId: string): void {
  _commands.delete(commandId);
}

export function processCommands(): void {
  const now = toSeconds(getTimestamp());
  const commands = [..._commands.values()];
  let toExecute = commands.filter(command => command.time <= now).sort((a, b) => a.time - b.time);

  if (toExecute.length > 0) {
    // Ring
    toExecute = [{ id: '_ring', type: 'ring', time: now, retries: 0 }, ...toExecute];
  }

  for (const command of toExecute) {
    _queuer.queue(async () => {
      await executeCommand(command);
    });
  }
}

export async function executeCommand(command: Command): Promise<void> {
  const payload =
    command.type === 'ring'
      ? [command.id, command.type]
      : [command.id, command.type, command.container];

  // Update time for retry
  command.retries++;
  command.time = toSeconds(getTimestamp()) + 5 * 60;

  if (command.retries === 4) {
    console.log('Expired Command');
    console.log(command);
    return deleteCommand(command.id);
  }

  _commands.set(command.id, command);

  console.log(`Execute command: ${command.id}`);

  await mqttPublish('MedCabCommandsRRC', payload.join('\n'));
}
