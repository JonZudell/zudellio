/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const StaticSiteGeneratorPlugin = require('./ssgwp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const data = require('./src/data');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class TemplateWrapperPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      'TemplateWrapperPlugin',
      (compilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: 'TemplateWrapperPlugin',
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          },
          (assets, callback) => {
            data.routes.forEach((route) => {
              const assetKey = `${route.replace(/^\//, '')}index.html`; // Remove prepended /

              const asset = assets[assetKey];
              if (asset) {
                const content = asset.source();
                const template = fs.readFileSync(
                  path.join(__dirname, '/src/index.html'),
                  'utf8',
                );

                const htmlOutput = template.replace(
                  '<!-- inject:body -->',
                  content,
                ); // Example modification
                assets[assetKey] = {
                  source: () => htmlOutput,
                  size: () => htmlOutput.length,
                };
              } else {
                console.warn(
                  `TemplateWrapperPlugin: Asset not found for route ${route}`,
                );
              }
            });
            callback();
          },
        );
      },
    );
  }
}

class RewritesPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('RewritesPlugin', (compilation, callback) => {
      const rewrites = data.routes.map((route) => {
        const source = route === '/' ? route : route.replace(/\/$/, '');
        return {
          source: source,
          destination: `${source.replace(/^\//, '')}/index.html`,
        };
      });

      const rewritesJson = JSON.stringify({ rewrites }, null, 2);

      compilation.assets['rewrites.json'] = {
        source: () => rewritesJson,
        size: () => rewritesJson.length,
      };

      callback();
    });
  }
}

module.exports = {
  mode: 'production',
  entry: {
    main: './src/csr.tsx',
    ssg: './src/ssg.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true,
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'scss-loader'],
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new StaticSiteGeneratorPlugin({
      entry: 'ssg',
      paths: data.routes,
      locals: {
        data: data,
      },
      globals: {
        window: {},
      },
    }),
    new TemplateWrapperPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new RewritesPlugin(),
  ],
  optimization: {
    minimize: false, // Disable code minification
  },
};
