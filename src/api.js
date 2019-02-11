const path = require('path');
const webpackConfig = require('../setup/webpack.base.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

export class API {

  constructor() {
    this.webpackConfig = webpackConfig;
  }

  ts(currentPath, desiredPath) {
    this.webpackConfig.entry[desiredPath] = [path.resolve(process.cwd(), currentPath)];
  }

  sass(currentPath, desiredPath) {
    this.webpackConfig.entry[Object.keys(webpackConfig.entry)[0]].push(path.resolve(process.cwd(), currentPath));
    this.webpackConfig.module.rules.push({
      test: process.cwd() + currentPath,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader'
        ]
      })
    });
    const index = this.webpackConfig.module.rules.findIndex(rule => {
      return rule.test === /\.(sass|scss)$/;
    });
    this.webpackConfig.module.rules[index].exclude.push(path.resolve(process.cwd(), currentPath));
    this.webpackConfig.plugins.push(new ExtractTextPlugin({ filename: desiredPath + '.css' }));
  }

  build() {
    return this.webpackConfig;
  }

}