'use strict'
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");//js压缩
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //css压缩

const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => merge(baseWebpackConfig(env, argv),{
    // 模式
    mode: "production",
    // 输出
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: "js/[name].[chunkhash].js",
    },
    // 插件
    plugins: [
    //   new CleanWebpackPlugin(),
      new webpack.HashedModuleIdsPlugin(),
    ],
    optimization: {
		minimizer: [//压缩js
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false
			}),
			new OptimizeCSSAssetsPlugin({})
		],
		splitChunks: { //压缩css
			cacheGroups: {
				styles: {
					name: "styles",
					test: /\.css$/,
					chunks: "all",
					enforce: true
				}
			}
		}
	}
});
