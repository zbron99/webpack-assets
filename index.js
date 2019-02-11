const path = require('path');
global.Config = require('./config.json');

const api = require('./api');
const API = new api();

require(path.resolve(process.cwd(), 'webpack.config'));

export default API;