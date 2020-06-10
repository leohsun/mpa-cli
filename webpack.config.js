const { resolve, basename, extname } = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CssPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')
const glob = require('glob')

const buildPath = path => resolve(__dirname, path)

function getEntry(globPath) {
  var files = glob.sync(globPath);
  var entries = {};
  for (var i = 0; i < files.length; i++) {
    var entry = files[i];
    entries[basename(entry, extname(entry))] = buildPath(entry);
  }
  return entries
}

const entryObj = getEntry(buildPath('src/scripts/**/*.js'))
const isDev = process.env.NODE_ENV === 'dev'
const isProd = process.env.NODE_ENV === 'production'

const config = {
  entry: entryObj,
  output: {
    filename: isProd ? 'scripts/[name].[hash:6].js' : 'scripts/[name].js',
    path: buildPath('./dist'),
    publicPath: isDev ? '/' : './',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: isProd ? CssPlugin.loader : 'style-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: (loader) => [
              require('postcss-import')({ root: loader.resourcePath }),
              require('postcss-preset-env')(),
              require('cssnano')()
            ]
          }
        }, 'css-loader'],
      },
      {
        test: /\.ejs$/, use: [
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
              attrs: ['img:src'],
              outputPath: 'htmls'
            }
          },
        ]
      },
      // {
      //   test: /\.(html)$/,
      //   use: [{
      //     loader: 'html-loader',
      //     options: {
      //       interpolate: true,
      //       attrs: ['img:src'],
      //     }
      //   },
      //   ]
      // },
      {
        test: /\.styl$/i,
        use: [
          // extract css
          {
            loader: isProd ? CssPlugin.loader : 'style-loader',
          },
          // Creates `style` nodes from JS strings
          // 'style-loader',

          // Translates CSS into CommonJS
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('cssnano')()
              ]
            },
          },
          // Compiles stylus to CSS
          'stylus-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 8k
              esModule: false, //patch for html-loader
              outputPath: './images'
            },
          },
        ],
      },
      {
        test: /\.mp3$/i,
        loader: 'file-loader',
        options: {
          outputPath: './sounds',
          esModule: false,
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env',
                {
                  "targets": {
                    "browsers": ["cover 99.5%"]
                  }
                }]
            ],
            "plugins": [
              ["@babel/plugin-transform-runtime"],
              [
                "@babel/plugin-proposal-class-properties",
                {
                  "loose": true
                }
              ], ["transform-async-to-generator"]
            ],

          }
        }
      }
    ],
  },

  devServer: {
    contentBase: buildPath('./dist'),
    compress: true,
    port: 8888,
    hot: true,
    host: '0.0.0.0',
    useLocalIp: true,
    open: true,
    disableHostCheck: true,
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'common',
          test: /\.(styl|css)$/,
          chunks: 'all',
        },
        scripts: {
          test: /\.js$/,
          name: 'common',
          chunks: 'all',
        }
      }
    },
    minimizer: [new UglifyJsPlugin()],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CleanWebpackPlugin(),

    new ProgressBarPlugin(),

    new CssPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: isDev ? '[name].css' : '[name].[hash:6].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ]
}

for (let key in entryObj) {
  if (entryObj.hasOwnProperty(key)) {
    config.plugins.push(
      new HtmlPlugin({
        filename: `${key}.html`,
        template: buildPath(`src/htmls/${key}.html`),
        chunks: ['common', `${key}`],
        minify: {
          collapseWhitespace: isProd,
          removeComments: isProd,
          removeRedundantAttributes: isProd,
          removeScriptTypeAttributes: isProd,
          removeStyleLinkTypeAttributes: isProd,
          useShortDoctype: isProd
        }
      })
    )
  }
}

module.exports = config