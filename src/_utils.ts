import * as utils from "path";
import * as os from "os";

export function isLikeDir(fp: string) {
  if (fp === "." || fp === "..") return true;

  return /(\/|\\)$/.test(fp.trimEnd());
}
export function fpSplit(fp: string, optimize = true): string[] {
  fp = fp.trim();
  const sp = fp
    .replace(/\//g, utils.sep)
    .split(utils.sep)
    .map((it) => it.trim())
    .filter((it) => !!it);
  if (!optimize) return sp;
  const result = [];
  let i = "";
  for (const name of sp) {
    if (!name.includes("*")) {
      i = utils.join(i, name);
    } else {
      if (i) result.push(i);
      result.push(name);
      i = "";
    }
  }
  if (i) result.push(i);
  return result;
}

export function fpBase(fp: string, paths: string[]): string {
  let base = "";
  if (utils.isAbsolute(fp)) {
    if (os.platform() === "win32") {
      base = utils.posix.isAbsolute(fp)
        ? __dirname.split(utils.sep)[0] ?? "C:"
        : paths.shift() ?? "C:";
      base += "//";
    } else {
      base = "/";
    }
  } else {
    if (
      paths.length === 1 &&
      paths[0] !== "." &&
      paths[0] !== ".." &&
      !/\/|\\/.test(paths[0])
    )
      paths.unshift(".");
    base = paths.shift() ?? ".";
  }
  return base;
}
export function pathTestExp(fp: string | string[]): RegExp {
  if (!Array.isArray(fp)) fp = [fp];
  const es = fp
    .map((it) => it.replace(/(\\)/g, "\\$1"))
    .map((it) => it.replace(/\*/g, ".*"))
    .join("|");
  return new RegExp("^(" + es + ")$");
}

export function toPs(ps: string | string[]): string[] {
  if (Array.isArray(ps)) return ps;
  else return [ps];
}
