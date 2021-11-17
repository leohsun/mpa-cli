const { resolve, basename, extname } = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const CssPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const ProgressBarPlugin = require("progress-bar-webpack-plugin")
const webpack = require("webpack")
const glob = require("glob")

const LibChunkDivider = "~"
const libChunkPrefix = "npm"

const buildPath = path => resolve(__dirname, path)

function getEntry(globPath) {
  var files = glob.sync(globPath)
  var entries = {}
  for (var i = 0; i < files.length; i++) {
    var entry = files[i]
    entries[basename(entry, extname(entry))] = buildPath(entry)
  }
  return entries
}

const componentEntry = buildPath("./src/components/entry.js")
const viewEntries = getEntry(buildPath("src/scripts/**/*.js"))

// const entryObj = { ...viewEntries, component: componentEntry }
const isDev = process.env.NODE_ENV == "dev"

const config = {
  entry: viewEntries,
  output: {
    filename: !isDev ? "scripts/[name].[hash:6].js" : "scripts/[name].js",
    path: buildPath("./dist"),
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: !isDev ? CssPlugin.loader : "style-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: loader => [
                  require("postcss-import")({ root: loader.resourcePath }),
                  require("postcss-preset-env")(),
                  require("cssnano")(),
                ],
              },
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(html)$/,
        // include: buildPath("./src/components/"), // for component of _.template()
        use: [
          {
            loader: "underscore-template-loader",
          },
        ],
      },
      {
        test: /\.styl$/i,
        use: [
          // extract css
          {
            loader: !isDev ? CssPlugin.loader : "style-loader",
          },
          // Creates `style` nodes from JS strings
          // 'style-loader',

          // Translates CSS into CommonJS
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: loader => [
                  require("postcss-import")({ root: loader.resourcePath }),
                  require("postcss-preset-env")(),
                  require("cssnano")(),
                ],
              },
            },
          },
          // Compiles stylus to CSS
          "stylus-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|ico)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb
          },
        },
        generator: {
          filename: "assets/images/[name].[hash][ext]",
        },
      },
      {
        test: /\.(ttf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[hash][ext]",
        },
      },
      {
        test: /\.mp3$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/sounds/[name].[hash][ext]",
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules|src\/lib/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["cover 99.5%"],
                  },
                },
              ],
            ],
            plugins: [
              ["@babel/plugin-transform-runtime"],
              ["@babel/plugin-proposal-class-properties"],
              ["transform-async-to-generator"],
            ],
          },
        },
      },
    ],
  },

  devServer: {
    static: {
      directory: buildPath("./dist"),
    },
    compress: true,
    port: 8888,
    hot: true,
    host: "local-ip",
    open: true,
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        scripts: {
          test: /src[\\/]scripts[\\/].*\.js$/,
          name: "common",
          chunks: "all",
        },

        // fooStyles: {
        //   type: "css/mini-extract",
        //   name: "styles_foo",
        //   chunks: chunk => {
        //     return chunk.name === "foo"
        //   },
        //   enforce: true,
        // },

        [libChunkPrefix]: {
          test: /node_modules/,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .match(/(?<=node_modules\/)[^\/]+/)
              .pop()
              .replace(/^@/, "")
            const allChunksNames = chunks
              .map(item => item.name)
              .join(LibChunkDivider)
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`
          },
          chunks: "all",
        },
      },
    },
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),

    new ProgressBarPlugin(),
    new CleanWebpackPlugin(),

    new CssPlugin({
      filename: !isDev ? "css/[name].[hash:6].css" : "css/[name].css",
    }),
  ],
}

for (let key in viewEntries) {
  if (viewEntries.hasOwnProperty(key)) {
    config.plugins.push(
      new HtmlPlugin({
        filename: `${key}.html`,
        template: buildPath(`src/htmls/${key}.html`),
        chunks: [key],
        inject: true,
        minify: {
          collapseWhitespace: !isDev,
          removeComments: !isDev,
          removeRedundantAttributes: !isDev,
          removeScriptTypeAttributes: !isDev,
          removeStyleLinkTypeAttributes: !isDev,
          useShortDoctype: !isDev,
        },
      })
    )
  }
}

module.exports = config
