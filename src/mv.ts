import * as fs from "fs";
import * as path from "path";
import { ls } from "./ls";
import { ft } from "./ft";
import { mkdir } from "./mkdir";
import * as utils from "./_utils";

export function mv(fp: string | string[], dst: string) {
  const ps = ls(fp);
  if (ps.length > 1) {
    if (ft("e", dst)) {
      if (ft("f", dst)) dst = path.dirname(dst);
    } else mkdir(dst);
    for (const src of ps)
      fs.renameSync(src, path.join(dst, path.basename(src)));
  } else {
    const src = ps[0];
    if (!ft("e", src)) return;
    if (!ft("e", dst)) {
      if (utils.isLikeDir(dst)) {
        mkdir(dst);
      } else {
        const parent = path.dirname(dst);
        if (!ft("e", parent)) mkdir(parent);
      }
    }
    if (ft("d", dst)) dst = path.join(dst, path.basename(src));
    fs.renameSync(src, dst);
  }
}
