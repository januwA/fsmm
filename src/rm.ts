import * as fs from "fs";
import { ls } from "./ls";

// 递归删除文件或目录
export function rm(fp: string | string[]) {
  const _rm = fs.rmSync ? fs.rmSync : fs.rmdirSync;
  for (const p of ls(fp)) _rm(p, { recursive: true });
}
