const path = require('path');
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  entry : path.resolve(__dirname,'src','app'),
  output : {
    path : path.resolve(__dirname,'./dist'),
    filename : 'bundle.js',
    publicPath : '/'
  },
  resolve : {
    extensions : ['.js','.jsx']
  },
  devServer : {
    historyApiFallback : true
  },
  module : {
    rules : [{
      test : /\.jsx?/,
      loader : 'babel-loader'
    }]
  },
  optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true, // Must be set to true if using source-maps in production
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          }
        }),
      ],
    },
  plugins: [
    new CompressionPlugin({cache: true,})
  ],
}
