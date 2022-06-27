import { db } from './db.js';
import { queueCommand } from './dispenser.js';
import { getTimestamp, toSeconds } from '../utils/helpers.js';
import { Command, Day, Days } from '../utils/types.js';

const updateFrequency = 1 * 60 * 1000;

export function controllerInit(): void {
  getMedications();
  setInterval(getMedications, updateFrequency);
}

export function getRange(offset = 0): {
  min: { day: Day; time: number };
  max: { day: Day; time: number };
} {
  const now = getTimestamp();

  const future = now + offset;

  console.log(`${new Date(now)}`);

  const min = {
    day: Days[new Date(now).getDay()],
    time: toSeconds(now),
  };

  const max = {
    day: Days[new Date(future).getDay()],
    time: toSeconds(future),
  };

  console.log({ min, max });

  return { min, max };
}

export async function getMedications(): Promise<void> {
  const range = getRange(updateFrequency);
  const matchQuery =
    range.min.day === range.max.day
      ? {
          $and: [
            {
              days: range.min.day,
              time: { $gte: range.min.time },
            },
            {
              days: range.max.day,
              time: { $lte: range.max.time },
            },
          ],
        }
      : {
          $or: [
            {
              days: range.min.day,
              time: { $gte: range.min.time },
            },
            {
              days: range.max.day,
              time: { $lte: range.max.time },
            },
          ],
        };

  const documents = await db
    .collection('schedules')
    .aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'medications',
          localField: 'medication',
          foreignField: '_id',
          as: '_medications',
        },
      },
      {
        $lookup: {
          from: 'medicines',
          localField: '_medications.medicine',
          foreignField: '_id',
          as: '_medicines',
        },
      },
      {
        $set: {
          medicine: { $arrayElemAt: ['$_medicines', 0] },
        },
      },
      {
        $project: { _medications: 0, _medicines: 0, days: 0 },
      },
    ])
    .toArray();

  const commands = documents.map(document => {
    const command = {
      id: document.medication,
      type: 'dispense',
      patient: document._id,
      medicine: document.medicine._id,
      container: document.medicine.container,
      time: document.time,
    } as Command;

    return command;
  });

  commands.forEach(command => queueCommand(command));
}
