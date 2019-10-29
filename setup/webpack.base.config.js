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
    hints: WebpackAssets.inProduction() ? 'warning' : false,
    maxAssetSize: 600000,
    maxEntrypointSize: 2000000
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
        // exclude: [/node_modules/, /src/],
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': ['vue-style-loader', {
              loader: 'css-loader',
              options: {
                url: false
              }
            }, 'sass-loader'],
            'sass': ['vue-style-loader', {
              loader: 'css-loader',
              options: {
                url: false
              }
            }, 'sass-loader']
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
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')()
              ]
            }
          },
        ]
      }
    ]
  },
  entry: {},
  output: {
    path: path.resolve(process.cwd(), 'public'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.vue'],
    alias: {
      vue$: WebpackAssets.inProduction() ? 'vue/dist/vue.min.js' : 'vue/dist/vue.esm.js'
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
