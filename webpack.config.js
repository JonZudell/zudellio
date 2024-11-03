const path = require('path');
const StaticSiteGeneratorPlugin = require('./ssgwp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const data = require('./src/data')

module.exports = {
  mode: 'production',
  entry: {
    main: './src/entry.tsx',
    ssg: './src/ssg.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd', // Ensure this is set
    globalObject: 'this',
    clean: true, // Clean the output directory before emit
  },
  devtool: 'source-map',
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  },
  plugins: [
    new StaticSiteGeneratorPlugin({
      entry: 'ssg',
      paths: data.routes,
      locals: {
        data: data,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.ids.HashedModuleIdsPlugin(), // For long term caching
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};