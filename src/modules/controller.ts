import { db } from '../index.js';
import { toSeconds } from '../utils/helpers.js';
import { Day, Days } from '../utils/types.js';

const updateFrequency = 5 * 60 * 60;

export function loadController(): void {
  getMedications();
  setInterval(getMedications, updateFrequency);
}

export function getRange(offset = 0): {
  min: { day: Day; time: number };
  max: { day: Day; time: number };
} {
  const now = Date.now();
  const future = now + offset;

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

  const result = await db
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
    ])
    .toArray();

  console.log(result);
}
