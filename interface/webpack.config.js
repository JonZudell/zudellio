/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const StaticSiteGeneratorPlugin = require('./ssgwp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const data = require('./src/data');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin'); // Add TerserPlugin

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
                let template = fs.readFileSync(
                  path.join(__dirname, '/src/index.html'),
                  'utf8',
                );

                // Append chunked CSS and JS files with content hashes
                const mainCss = Object.keys(assets).find((key) => key.startsWith('main') && key.endsWith('.css'));
                const mainJs = Object.keys(assets).find((key) => key.startsWith('main') && key.endsWith('.js'));

                if (mainCss) {
                  template = template.replace(
                    '</head>',
                    `<link rel="stylesheet" href="/${mainCss}"></head>`
                  );
                }

                if (mainJs) {
                  template = template.replace(
                    '</body>',
                    `<script defer src="/${mainJs}"></script></body>`
                  );
                }

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
  mode: 'development',
  entry: {
    main: './src/csr.tsx',
    ssg: './src/ssg.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
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
      filename: '[name].[contenthash].css',
    }),
    new RewritesPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' },
      ],
    }),
  ],
  optimization: {
    minimize: false, // Disable code minification
    minimizer: [
      new TerserPlugin({
        extractComments: false, // Ensure comments are preserved
        terserOptions: {
          format: {
            comments: true, // Preserve comments
          },
        },
      }),
    ],
    sideEffects: true, // Enable tree shaking
    usedExports: true, // Enable tree shaking
  },
};
