const merge = require('webpack-merge'),
      common = require('./webpack.common.js'),
      BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
      webpack = require('webpack');

module.exports = merge(common, {
   mode: 'production',
   devtool: "source-map",
   plugins: [
      new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production')
      }),
   ]
});