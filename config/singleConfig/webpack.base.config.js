const HtmlWebpackPlugin = require('html-webpack-plugin')

const { srcPath, indexJsPath, indexHtmlPath  } = require('../file.path')
const path = require('path');
// 生成HTML文件
const generateIndex = new HtmlWebpackPlugin({
    inject: 'body',
    filename: 'index.html',
    template: indexHtmlPath
})

module.exports = {
    // 基础目录（绝对路径），用于从配置中解析入口点和加载程序
    // 默认使用当前目录，但建议在配置中传递一个值。这使得您的配置独立于CWD（当前工作目录）
    context: srcPath,

    // 入口文件 单页面. 也可以多页面enter:{a:'',b:''}在多页应用中，（译注：每当页面跳转时）服务器将为你获取一个新的 HTML 文档。页面重新加载新文档，并且资源被重新下载。然而，这给了我们特殊的机会去做很多事
    entry: indexJsPath,

    // 输入配置
    // output: {
    //     path: path.join(__dirname, "./build/"),
    //     filename: "build.js",
    // },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "[name].js",
      },

    // 模块配置
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)/,
                use: 'babel-loader'
            },
            { test: /\.css$/, use: 'css-loader' }
        ]
    },

    // 插件配置
    plugins: [
        generateIndex
    ]
}