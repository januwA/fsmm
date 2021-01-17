process.env.NODE_ENV = "production";
const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const util = require("./util");

const prodConfig = {
  target: "node",
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(util.rootPath(), "tsconfig.build.json"),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    // 压缩js,css文件
    minimizer: [new TerserJSPlugin({})],
    // 删除空的块
    removeEmptyChunks: true,
    // 合并包含相同模块的块
    mergeDuplicateChunks: true,
  },
};

const entrys = util.entry();
const outputs = util.output();

module.exports = [
  {
    entry: entrys[0],
    output: outputs[0],
    ...prodConfig,
  },
  {
    entry: entrys[1],
    output: outputs[1],
    ...prodConfig,
  },
];
