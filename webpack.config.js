const path = require('path');
const fs = require('fs');
const StaticSiteGeneratorPlugin = require('./ssgwp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const data = require('./src/data');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class TemplateWrapperPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('TemplateWrapperPlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'TemplateWrapperPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets, callback) => {
          console.log('TemplateWrapperPlugin: processAssets hook triggered');
          data.routes.forEach(route => {
            const assetKey = `${route.replace(/^\//, '')}index.html`; // Remove prepended /
            
            const asset = assets[assetKey];
            console.log(assets)
            if (asset) {
              const content = asset.source();
              const template = fs.readFileSync(path.join(__dirname, '/src/index.html'), 'utf8');
              
              const htmlOutput = template.replace('<!-- inject:body -->', content); // Example modification
              console.log(`TemplateWrapperPlugin: Rewriting ${route}index.html`);
              assets[assetKey] = {
                source: () => htmlOutput,
                size: () => htmlOutput.length,
              };
            } else {
              console.warn(`TemplateWrapperPlugin: Asset not found for route ${route}`);
            }
          });
          callback();
        }
      );
    });
  }
}

module.exports = {
  mode: 'production',
  entry: {
    main: './src/csr.tsx',
    ssg: './src/ssg.tsx'
  },
  output: {
    filename: '[name].js',
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
    new webpack.ids.HashedModuleIdsPlugin(), // For long term caching
    new TemplateWrapperPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};