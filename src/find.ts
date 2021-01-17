import { pathTestExp, toPs } from "./_utils";
import { exclude_t } from "./_interface";
import { ls } from "./ls";
import { ft } from "./ft";

interface IFindOptions {
  ps?: string | string[];
  exclude?: exclude_t;
  type?: string;
}

function isFindOptions(ps: any): ps is IFindOptions {
  return Object.prototype.toString.call(ps) === "[object Object]";
}

export function find(dir: string | string[]): string[]; // 1
export function find(dir: string | string[], ps?: string | string[]): string[]; // 2
export function find(
  dir: string | string[],
  options?: IFindOptions | exclude_t
): string[]; // 3

// fs.find("./")
// fs.find("./", "*.js")
// fs.find("./dist", /node_modules|\.git/)
// fs.find("./", ["*.[jt]s", "*.ts"], /node_modules/)
//
// fs.find("./dist", {
//   type: "f",
//   ps: '*.ps',
//   exclude: /node_modules|\.git/,
// })
//
// fs.find(".", {
//     type: "f",
//     exclude: /node_modules|\.git/,
//   })
export function find(
  dir: string | string[],
  ps?: string | string[] | exclude_t | IFindOptions,
  exclude?: exclude_t
): string[] {
  const result: string[] = [];
  let type: string | undefined;
  let hasPs = !!ps;

  // 重载 3
  if (ps instanceof RegExp || typeof ps === "function") {
    exclude = ps;
    hasPs = false;
    ps = "*";
  } else if (isFindOptions(ps)) {
    type = ps.type;
    exclude = ps.exclude;
    if (!ps.ps) hasPs = false;
    ps = ps.ps ?? "*";
  }

  // 重载 1
  if (!ps) ps = "*";

  dir = toPs(dir);
  ps = toPs(ps);

  const _exp = pathTestExp(ps);
  _scan(dir, result);

  function _scan(dir: string | string[], result: string[]) {
    for (const f of ls(dir, exclude)) {
      if (ft("f", f)) {
        if (_exp.test(f)) _joinResult(f);
      } else {
        if (!hasPs) _joinResult(f); // 如果查询指定文件，则不返回目录
        _scan(f, result);
      }
    }
  }

  function _joinResult(fp: string) {
    if (type) {
      if (ft(type, fp)) result.push(fp);
    } else {
      result.push(fp);
    }
  }

  return result;
}
