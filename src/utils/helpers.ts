import fs from 'fs';
import path from 'path';

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
