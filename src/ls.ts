import * as path from "path";
import * as fs from "fs";
import * as assert from "assert";
import * as utils from "./_utils";
import { exclude_t } from "./_interface";

function _isDir(fp: string) {
  try {
    const stats = fs.statSync(fp);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

function _filter(dir: string, children: string[], exclude?: exclude_t) {
  if (!exclude) return children;
  return children.filter((it) => {
    if (exclude instanceof RegExp) {
      if (!exclude.test(it)) return it;
    } else {
      if (!exclude(dir, it)) return it;
    }
  });
}

function deep(
  _fp: string,
  parent: string,
  paths: string[],
  result: string[],
  exclude?: exclude_t
) {
  let ffile = paths.shift();
  if (!ffile) {
    if (_isDir(parent)) {
      const children = _filter(parent, fs.readdirSync(parent), exclude);
      result.push(...children.map((it) => path.join(parent, it)));
      return;
    } else return result.push(parent);
  }
  const exp = ffile ? utils.pathTestExp(ffile) : null;
  let children = _filter(parent, fs.readdirSync(parent), exclude);
  if (exp) children = children.filter((child) => exp.test(child));
  if (!children.length && paths.length) {
    throw `ls: cannot access '${_fp}': No such file or directory`;
  }
  if (!children.length && !paths.length) return;
  const inDir = _fp.endsWith("/") || _fp.endsWith("\\");
  for (const child of children) {
    const ffp = path.join(parent, child);
    const isDir = _isDir(ffp);
    if (!paths.length && !isDir && !inDir) {
      result.push(ffp);
    } else if (isDir) deep(_fp, ffp, paths.slice(0), result);
  }
}

export function ls(fp: string | string[] = "./", exclude?: exclude_t) {
  fp = utils.toPs(fp);
  const result = [];
  for (const _fp of fp) {
    const paths = utils.fpSplit(_fp);
    const base = utils.fpBase(_fp, paths);
    if (!base) continue;
    if (!_isDir(base)) {
      result.push(base);
      continue;
    }
    if (!paths.length) {
      result.push(
        ..._filter(base, fs.readdirSync(base), exclude).map((it) =>
          path.join(base, it)
        )
      );
    } else {
      assert.ok(paths.length);
      deep(_fp, base, paths, result, exclude);
    }
  }
  return result;
}
