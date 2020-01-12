const { resolve, basename, extname } = require('path')

const HtmlPlugin = require('html-webpack-plugin')
const CssPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')
const glob = require('glob')


const buildPath = (path) => resolve(__dirname, path)
console.log('process.env.NODE_ENV -->', process.env.NODE_ENV)

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

const config = {
  entry: entryObj,
  output: {
    filename: process.env.NODE_ENV === 'dev' ? '[name].js' : '[name].[hash:6].js',
    path: buildPath('./dist'),
    publicPath: process.env.NODE_ENV === 'dev' ? '/' : './',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: CssPlugin.loader,
          options: {
            publicPath: './'
          }
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
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':src'],
          }
        }
      },
      {
        test: /\.styl$/i,
        use: [
          // extract css
          {
            loader: CssPlugin.loader,
            options: {
              publicPath: './'
            }
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
      // {
      //   test: /\.(ttf)$/i,
      //   loader: 'file-loader',
      //   options: {
      //     outputPath: 'images'
      //   }
      // },
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
    port: 9009,
    hot: true,
    host: '0.0.0.0',
    useLocalIp: true,
    open: true,
    disableHostCheck: true,
  },

  optimization: {
    splitChunks: {
      // include all types of chunks
      name: 'common',
      chunks: 'all'
    },
    minimizer: [new UglifyJsPlugin()],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
    }),
    new CleanWebpackPlugin(),

    new ProgressBarPlugin(),

    new CssPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: process.env.NODE_ENV === 'dev' ? 'css/[name].css' : 'css/[name].[hash:6].css',
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
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      })
    )
  }
}
module.exports = config