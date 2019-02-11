const path = require('path');
global.Config = require('./config.json');

const API = require('./src/api');
const asset = new API();

module.exports = asset;

const WebpackAssetsConfig = require(path.resolve(process.cwd(), 'webpack.config'));
module.exports.WebpackAssetsConfig = WebpackAssetsConfig;