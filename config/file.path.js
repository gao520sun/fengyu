const { resolve } = require('path')

// 项目根目录
const projectPath = process.cwd()
// 代码地址目录
const srcPath = resolve(projectPath, 'src')
// 入口文件目录
const mainPath = resolve(srcPath, 'main')

// output:{
//     path: path.resolve(__dirname,"build")
// },
// 入口文件
// const indexJsPath = resolve(mainPath, 'index.jsx')
const indexJsPath = resolve(mainPath, 'index.jsx')
const indexHtmlPath = resolve(mainPath, 'index.html')

module.exports = {
    srcPath,
    mainPath,
    indexJsPath,
    indexHtmlPath
}