const path = require('path');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const data = require('./src/data.tsx')
module.exports = {
  mode: 'production',
  entry: ["./src/ssg.tsx"],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this', // Add this line
  },
  devtool: 'source-map',
  resolve: {
    fallback: {
      fs: false, // Mock 'fs' module
      path: require.resolve('path-browserify'), // Mock 'path' module with 'path-browserify'
      crypto: require.resolve('crypto-browserify'), // Mock 'crypto' module with 'crypto-browserify'
      stream: require.resolve('stream-browserify'), // Mock 'stream' module with 'stream-browserify'
      buffer: require.resolve('buffer/'), // Mock 'buffer' module with 'buffer'
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
  plugins: [
    new StaticSiteGeneratorPlugin({
      entry: 'bundle.js',
      paths: data.routes, // Add your routes here
      locals: {
        data: data, // Pass your data here
      },
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};