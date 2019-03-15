const WebpackAssets = require('../src/webpack-assets');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const NotifierPlugin = require('webpack-notifier');
const path = require('path');
const uuidv4 = require('uuid/v4');

module.exports = {
  mode: WebpackAssets.environment(),
  stats: {
    all: false,
    assets: true,
    performance: true,
    errors: true
  },
  performance: {
    hints: WebpackAssets.inProduction() ? true : false
  },
  optimization: WebpackAssets.inProduction() ? {
    namedChunks: false,
    minimizer: [
      new TerserPlugin(Config.terser),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', Config.cssNano]
        }
      })
    ]
  } : {
    namedChunks: false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: [/node_modules/, /src/],
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': ['vue-style-loader', 'css-loader', 'sass-loader'],
            'sass': ['vue-style-loader', 'css-loader', 'sass-loader']
          }
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: path.resolve(process.cwd(), '.tsconfig/tsconfig.client.json')
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sass|scss)$/,
        exclude: [],
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer')()
                ]
              }
            },
            'resolve-url-loader',
            'sass-loader'
          ]
        })
      },
    ]
  },
  entry: {},
  output: {
    path: path.resolve(process.cwd(), 'public'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      vue: 'vue/dist/vue.js',
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new WebpackBarPlugin(),
    new VueLoaderPlugin(),
    new ManifestPlugin({
      map: (file) => {
        const extension = path.extname(file.name).slice(1);
        return {
          ...file,
          path: file.path + '?id=' + uuidv4(),
          name: ['css'].includes(extension) ?
            file.path.substr(1) :
            file.name
        };
      }
    }),
    new NotifierPlugin({
      alwaysNotify: true
    })
  ]
};