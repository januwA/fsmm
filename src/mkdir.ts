import * as fs from "fs";
export function mkdir(fp: string) {
  return fs.mkdirSync(fp, { recursive: true });
}
