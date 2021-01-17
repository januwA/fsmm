const path = require("path");
class Util {
  /**
   * 返回项目根目录
   */
  rootPath() {
    return path.resolve(__dirname, "../../");
  }

  /**
   * 返回打包入口文件路径
   */
  entry() {
    return [
      path.resolve(this.rootPath(), "src", "index.ts"),
      path.resolve(this.rootPath(), "src", "async", "index.ts"),
    ];
  }

  output() {
    return [
      {
        filename: "index.js",
        path: path.resolve(this.rootPath(), "dist"),
        libraryTarget: "commonjs2",
      },
      {
        filename: "index.js",
        path: path.resolve(this.rootPath(), "dist", "async"),
        libraryTarget: "commonjs2",
      },
    ];
  }
}
const util = new Util();
module.exports = util;
