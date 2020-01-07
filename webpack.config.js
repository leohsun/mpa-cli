const { resolve } = require('path')

const HtmlPlugin = require('html-webpack-plugin')
const CssPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')


const buildPath = (path) => resolve(__dirname, path)
console.log('process.env.NODE_ENV -->', process.env.NODE_ENV)

module.exports = {
  entry: {
    'member-center': buildPath('./src/scripts/member-center.js')
  },

  output: {
    filename: '[name].[hash:6].js',
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
            publicPath: buildPath('dist/css')
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
              publicPath: buildPath('./dist')
              // publicPath: (resourcePath, context) => {
              //   // publicPath is the relative path of the resource to the context
              //   // e.g. for ./css/admin/main.css the publicPath will be ../../
              //   // while for ./css/main.css the publicPath will be ../
              //   console.log('resourcePath:', resourcePath)
              //   return '/';
              // }
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
              limit: 8192,
              esModule: false, //patch for html-loader
              outputPath: 'images'
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
                    "browsers": ["last 2 Chrome versions"]
                  }
                }]
            ],
            "plugins": [
              [
                "@babel/plugin-proposal-class-properties",
                {
                  "loose": true
                }
              ], ["transform-async-to-generator"]
            ]
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
  },

  optimization: {
    // splitChunks: {
    //   // include all types of chunks
    //   chunks: 'all'
    // },
    // minimizer: [new UglifyJsPlugin()],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
    }),

    new ProgressBarPlugin(),

    new HtmlPlugin({
      filename: 'member-center.html',
      template: buildPath('src/htmls/member-center.html'),
      favicon: buildPath('./src/assets/images/favicon.ico'),
      chuncks: ['member-center'],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),


    new CssPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].[hash:6].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ]

}