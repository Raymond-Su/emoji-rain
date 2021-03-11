const webpack = require("webpack"),
  fs = require('fs-extra'),
  CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
let config = require("../webpack.config");

console.log("cleaning build folder")
fs.emptyDirSync('build')

config.plugins = [
  // clean the build folder
  new CleanWebpackPlugin(),
].concat(config.plugins);

console.log("build started")
webpack(config, function(err) {
  if (err) throw err;
  console.log("build succeeded")
});




