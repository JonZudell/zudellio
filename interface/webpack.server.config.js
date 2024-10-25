const path = require('path');
module.exports = {
  mode: 'production',
  entry: './client.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'app',
    libraryTarget: 'umd',
    globalObject: 'globalThis'
  },
  // Module rules
  module: {
    rules: [

      {
        test: /\.css$/,
        use: ['css-loader', 'postcss-loader'],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  
  // Resolve configuration
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  // Target environment
  optimization: {
    minimize: false, // Disable code minification
  },
  target: "web"
};