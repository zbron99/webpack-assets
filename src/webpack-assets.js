class WebpackAssets {

  static environment() {
    return process.env.NODE_ENV;
  }

  static inProduction() {
    return WebpackAssets.environment() === 'production';
  }

}

module.exports = WebpackAssets;