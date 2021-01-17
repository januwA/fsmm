import * as fs from "fs";
export function line(
  fp: string,
  cb: (line: string) => string | void
): {
  changeLine: number;
  size: number;
  maxLine: number;
} {
  let lineIndex = 0;
  let changeLine = 0;
  const bufs = fs.readFileSync(fp);
  const size = bufs.length;
  const lines = bufs.toString().split(/\r?\n/g);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i],
      r = cb(line);
    if (r && r !== line) {
      lines[i] = r;
      changeLine++;
    }
    lineIndex++;
  }
  const data = lines.join("\r\n");
  if (changeLine) fs.writeFileSync(fp, data);
  return {
    changeLine,
    size,
    maxLine: lineIndex,
  };
}
