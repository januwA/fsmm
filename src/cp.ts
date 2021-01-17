import * as fs from "fs";
import * as path from "path";
import { ft } from "./ft";
import { mkdir } from "./mkdir";
import * as utils from "./_utils";
import { find, ls } from "./";
import { exclude_t } from "./_interface";

let l = console.log;

// 拷贝文件
// cp('./dist/a.txt', './')
// cp('./dist/a.txt', './b.txt')
// cp('./dist/a.txt', './out/')
// cp('./dist/a.txt', './out/b.txt')
// cp('./README.md', './out/a.md')
// cp('./README.md', './out')
// cp('./README.md', './out/')
// cp("./dist/async", './out/')
// cp(["./dist/async", "./README.md"], './out/')
// cp("./dist/async/*", './out/')
// cp(["./dist/async", "./*.md"], './out/')
// cp("./dist/*/*", './out/')
// cp("../datas", './out/')
export function cp(src: string | string[], dst: string, exclude?: exclude_t) {
  src = utils.toPs(src);

  if (!ft("e", dst)) {
    const dstLikeDir = utils.isLikeDir(dst);
    if (dstLikeDir) mkdir(dst);
    else mkdir(path.dirname(dst));
  }

  for (const it of src) _save(it, dst);
  function _save(src: string, dst: string) {
    const isDir = ft("d", src);
    const paths: string[] = ls(src, exclude);
    if (!isDir) {
      for (const d of paths) {
        try {
          fs.copyFileSync(d, dst);
        } catch (error) {
          fs.copyFileSync(d, path.join(dst, path.basename(d)));
        }
      }
    } else {
      const newDst = mkdir(path.join(dst, path.basename(src)));
      for (const d of paths) _save(d, newDst);
    }
  }
}
