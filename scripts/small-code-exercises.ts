import { readdirSync } from "fs"

function transformStringArrayToStringAndNumArray(strArray: string[]): (string | number)[] {
  return strArray.map(item => isNaN(Number(item)) ? item : Number(item))
}

function getFiles(): string[] {
  const filesDir = `${__dirname}/../files`;
  const files = readdirSync(filesDir);
  return files.filter(file => /.*\.(csv)/ig.test(file));
}

function checkStringForDigits(str: string): boolean {
  return /\d/g.test(str);
}
