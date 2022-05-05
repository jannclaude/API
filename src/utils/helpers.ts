import fs from 'fs';
import path from 'path';

const utcOffset = 8;

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getFiles(dir: string): string[] {
  return fs.readdirSync(dir).reduce<string[]>((list, file) => {
    const name = path.join(dir, file);
    const isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? getFiles(name) : [name]);
  }, []);
}

export function toSeconds(timestamp: number): number {
  const date = new Date(timestamp);
  const hours = date.getHours() * 3600;
  const mins = date.getMinutes() * 60;
  const secs = date.getSeconds();

  return hours + mins + secs;
}

export function toDate(seconds: number): Date {
  const hours = seconds / 3600;
  seconds -= hours * 3600;
  const minutes = seconds / 60;
  seconds -= minutes * 60;

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  return date;
}

export function getTimestamp(): number {
  let now = Date.now();
  if (process.env.IN_PROD) now += utcOffset * 3600000;
  return now;
}
