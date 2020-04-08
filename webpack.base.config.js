

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//css分离打包
const createHtml =require("./config/create-html");// html配置
const getEntry = require("./config/get-entry");
const entry = getEntry("./src/pages");
const htmlArr = createHtml("./src/pages");
//主配置
module.exports = (env, argv) => ({
	entry: entry,
	output: {
		path: path.join(__dirname, "build"),
		filename: "./[name].js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader:"babel-loader",
					options:{
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							{"plugins": ["@babel/plugin-proposal-class-properties"]} //这句很重要 不然箭头函数出错
						], 
					}
				},
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|css)$/, //css打包 路径在plugins里
				use: [
					argv.mode == "development" ? { loader: "style-loader"} :MiniCssExtractPlugin.loader,
					{ loader: "css-loader", options: { url: false, sourceMap: true } },
					{ loader: "sass-loader", options: { sourceMap: true } }
				],
				exclude: /node_modules/,
			},
			{
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
                options:{
                    publicPath:'/'
                }
            },
		 
		],
	},
	resolve:{
		alias:{
			src:path.resolve(__dirname,"src/"),
			component:path.resolve(__dirname,"src/component/"),
			store:path.resolve(__dirname,"src/store/"),
		}
	},
	plugins: [
		...htmlArr, // html插件数组
		new MiniCssExtractPlugin({ //分离css插件
			filename: "[name].css",
			chunkFilename: "[id].css"
		})
	],
	externals:{
		'QMap':'qq.maps'
	  },
});
