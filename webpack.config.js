const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin')
const WebpackAutoInject = require('webpack-auto-inject-version')

module.exports = (env, argv) => {
  const autoIncreaseVersion = argv.mode === 'production'

  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      template: './src/templates/index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(['docs/*', '*.css'], {}),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['docs'] },
      open: false
    }),
    new CopyWebpackPlugin([
      {
        from: '**/*.*',
        to: '[path][name].[ext]',
        context: 'src/',
        ignore: ['scripts/**', 'styles/**', 'templates/**']
      },
    ]),
    new WebpackShellPlugin({
      dev: false,
      onBuildEnd: ['node postbuild.js']
    }),
    new WebpackAutoInject({
      components: {
        AutoIncreaseVersion: autoIncreaseVersion,
        InjectAsComment: false,
        InjectByTag: true
      }
    })
  ]

  return {
    entry: {
      'flat': './src/scripts/flat-default.js',
      'flat-core': './src/scripts/flat-core.js',
      'flat-theme': './src/scripts/flat-theme.js',
      'flat-classes': './src/scripts/flat-classes.js',
      'flat-colorless': './src/scripts/flat-colorless.js'
    },
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { url: false }
            },
            'css-loader'
          ]

        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sass|scss|css)$/,
          use: [
            {
              loader: 'style-loader',
              options: {}
            },
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { url: false }
            },
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins
  }
}
