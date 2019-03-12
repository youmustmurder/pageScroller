const UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
      merge = require('webpack-merge'),
      common = require('./webpack.common.js'),
      webpack = require('webpack');

module.exports = merge(common, {
   mode: 'production',
   plugins: [
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production')
      }),
   ]
});