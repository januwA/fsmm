import * as fs from "fs";
import { ls } from "./ls";
import { toPs } from "./_utils";

function isTextFile_s(fp: string) {
  let isText = true;
  const buf = Buffer.alloc(Math.min(fs.statSync(fp).size, 1024));
  fs.readSync(fs.openSync(fp, "r"), buf, 0, buf.length, 0);
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0) {
      isText = false;
      break;
    }
  }
  return isText;
}

function _exsist(fp: string) {
  try {
    fs.accessSync(fp, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

// fs.ft("f", "./*.md")
export function ft(symbol: string, fp: string) {
  if (!_exsist(fp)) {
    fp = ls(fp)[0]; // 取第一个进行判断
  }

  switch (symbol) {
    case "r":
      try {
        fs.accessSync(fp, fs.constants.R_OK);
        return true;
      } catch (error) {
        return false;
      }
    case "w":
      try {
        fs.accessSync(fp, fs.constants.W_OK);
        return true;
      } catch (error) {
        return false;
      }
    case "x":
      try {
        fs.accessSync(fp, fs.constants.X_OK);
        return true;
      } catch (error) {
        return false;
      }
    case "e":
      return _exsist(fp);
    case "f":
      try {
        const stats = fs.statSync(fp);
        return stats?.isFile();
      } catch (error) {
        return false;
      }
    case "d":
      try {
        const stats = fs.statSync(fp);
        return stats?.isDirectory();
      } catch (error) {
        return false;
      }
    case "z":
      try {
        const stats = fs.statSync(fp);
        if (stats.isDirectory() || stats.size !== 0) return false;
        return true;
      } catch (e) {
        return false;
      }
    case "s":
      try {
        const stats = fs.statSync(fp);
        return stats?.size;
      } catch (error) {
        return 0;
      }
    case "l":
      try {
        return fs.lstatSync(fp).isSymbolicLink();
      } catch (error) {
        return false;
      }
    case "S":
      try {
        const stats = fs.statSync(fp);
        return stats?.isSocket();
      } catch (error) {
        return false;
      }
    case "p":
      try {
        const stats = fs.statSync(fp);
        return stats?.isFIFO();
      } catch (error) {
        return false;
      }
    case "b":
      try {
        const stats = fs.statSync(fp);
        return stats?.isBlockDevice();
      } catch (error) {
        return false;
      }
    case "c":
      try {
        const stats = fs.statSync(fp);
        return stats?.isCharacterDevice();
      } catch (error) {
        return false;
      }
    case "M":
      try {
        const stats = fs.statSync(fp);
        return stats?.mtime;
      } catch (error) {
        return "";
      }
    case "A":
      try {
        const stats = fs.statSync(fp);
        return stats?.atime;
      } catch (error) {
        return "";
      }
    case "T":
      return isTextFile_s(fp);
    case "B":
      return !isTextFile_s(fp);
  }
}
