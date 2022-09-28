const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     entry: './build/index.js',
//     output: {
//         path: path.resolve(__dirname, 'build'),
//         filename: 'index.js'
//     },
//     loader:
//     {
//         test: /\.js$/,
//         loader: 'babel-loader',
//         query: {
//             presets: ['es2015']
//         }
//     },
//     mode: 'none'
// }


module.exports = {
  entry: './src/app/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/app/index.html' })]
};