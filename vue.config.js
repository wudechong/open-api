const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

const isProduction = process.env.NODE_ENV === "production";

function resolve(dir) {
	return path.join(__dirname, dir);
}

const config = require("./projects.config");
let myConfig = {};
if (fs.existsSync("./projects-my.config.js")) {
	myConfig = require("./projects-my.config");
}

let projectName = myConfig.defaultProject || config.defaultProject;
const commandLine = process.env.npm_lifecycle_script;
const cmd = process.argv[2];
if (commandLine) {
	const matches = commandLine.match(/:\s+"(.+)"$/);
	if (matches && matches.length > 1) {
		projectName = matches[1];
	}
}

if (!projectName) {
	console.error(`未指定要启动的子项目名，请配置defaultProject或使用如下命令...\n\nnpm run ${cmd} 子项目名\n\n`);
	process.exit(0);
}

const entries = [];
let projectConfig = config.projects[projectName] || {};

const myProjectConfigs = myConfig.projects;
if (myProjectConfigs) {
	const myProjectConfig = myProjectConfigs[projectName];
	if (myProjectConfig) {
		if (!projectConfig) {
			projectConfig = myProjectConfig;
		} else {
			for (const p in myProjectConfig) {
				if (["env", "proxy"].indexOf(p) < 0) {
					projectConfig[p] = myProjectConfig[p];
				}
			}

			const env = config.env || {};
			if (myConfig.env) Object.assign(env, myConfig.env);
			if (projectConfig.env) Object.assign(env, projectConfig.env);
			if (myProjectConfig.env) Object.assign(env, myProjectConfig.env);
			projectConfig.env = env;

			const proxy = config.proxy || {};
			if (myConfig.proxy) Object.assign(proxy, myConfig.proxy);
			if (projectConfig.proxy) Object.assign(proxy, projectConfig.proxy);
			if (myProjectConfig.proxy) Object.assign(proxy, myProjectConfig.proxy);
			projectConfig.proxy = proxy;
		}
	}
}

if (projectConfig.env) {
	Object.assign(process.env, projectConfig.env);
}
if (projectConfig.entries) {
	if (projectConfig.entries instanceof Array) {
		entries.push(...projectConfig.entries);
	} else {
		entries.push(...projectConfig.entries.split(","));
	}
}

if (entries.length === 0) {
	entries.push(projectName);
}

const PAGES_PATH = resolve("./src/pages");
const pages = {};
for (const entry of entries) {
	pages[entry] = {
		entry: `${PAGES_PATH}/${entry}/main.js`,
		template: `${PAGES_PATH}/${entry}/index.html`,
		filename: `${entry}/index.html`,
		chunks: ["chunk-vendors", "chunk-common", entry]
	};
}

const TIMESTAMP = require("moment")().format("YYYYMMDD[T]HHmm");

const RouterBasePathPlugin = require("calf-webpack").RouterBasePathPlugin;

const PRODUCTION_CONFIG = {
	cdn: {
		css: [
			`//hcalf.hupun.com/front/${process.env.APP_COMMON_LIB_VERSION}/3rd.min.css`
		],
		js: [
			`//hcalf.hupun.com/front/${process.env.APP_COMMON_LIB_VERSION}/3rd.min.js`
		]
	},
	externals: {
		"mockjs": "mockjs",
		"@mock": "undefined",

		"vue": "Vue",
		"vue-router": "VueRouter",
		"vuex": "Vuex",
		"vue-i18n": "VueI18n",
		"vue-clipboard2": "VueClipboard",
		"vue-lazyload": "VueLazyload",
		"axios": "axios",

		"element-ui": "ELEMENT",
		"element-ui/lib/theme-chalk/index.css": "ELEMENT",
		"nprogress": "NProgress",
		"moment": "moment",
		"numeral": "numeral",

		"vxe-table": "window.VXETable",
		"xe-utils": "window.XEUtils",
		"vxe-table-plugin-element": "undefined",

		"splitpanes": "window.splitpanes"
	}
};

const proxy = {
};

if (projectConfig.proxy) {
	Object.assign(proxy, projectConfig.proxy);
}

const target = projectConfig.serviceTarget || myConfig.serviceTarget ||
	config.serviceTarget || process.env.APP_SERVICE_TARGET;
for (let path in proxy) {
	path = path + "";
	const conf = proxy[path];

	if (conf.changeOrigin === undefined) conf.changeOrigin = true;
	if (!conf.target) {
		conf.target = target || "http://localhost";
	}

	if (path.match(/[;,]/)) {
		delete proxy[path];
		for (let eachPath of path.split(/[;,]/)) {
			if (!eachPath) {
				continue;
			}
			proxy[eachPath.trim()] = conf;
		}
	}
}

const plugins = [
	new RouterBasePathPlugin()
];

if (!isProduction && cmd === "serve") {
	const HtmlWebpackPlugin = require("html-webpack-plugin");
	plugins.push(new HtmlWebpackPlugin({
		template: resolve("public/home.html"),
		filename: "index.html",
		chunks: [],
		templateParameters: {
			title: `${config.team} / ${projectName}`,
			entries
		}
	}));
} else {
	const FileManagerPlugin = require("filemanager-webpack-plugin");
	const buildDist = `./dist/${projectName}/${TIMESTAMP}`;
	plugins.push(new FileManagerPlugin({
		events: {
			onStart: {
				delete: [
					"./dist"
				]
			},
			onEnd: {
				delete: [
					`${buildDist}/home.html`
				],
				archive: [
					{
						source: `${buildDist}/`,
						destination: `${buildDist}.zip`
					}
				]
			}
		}
	}));
}

const configs = {
	pages: pages,
	outputDir: `./dist/${projectName}/${isProduction ? TIMESTAMP + "/" : ""}`,
	productionSourceMap: false,

	configureWebpack: config => {
		// if prod is on, add externals
		config.externals = isProduction ? PRODUCTION_CONFIG.externals : {};
		// externals: PRODUCTION_CONFIG.externals,
		config.plugins = [...config.plugins, ...plugins];

		config.optimization = {
			splitChunks: {
				cacheGroups: {
					common: {
						name: "chunk-common",
						chunks: "initial",
						minChunks: 2,
						maxInitialRequests: 5,
						minSize: 0,
						priority: 1,
						reuseExistingChunk: true,
						enforce: true
					},
					vendors: {
						name: "chunk-vendors",
						test: /[\\/]node_modules[\\/]/,
						chunks: "initial",
						minSize: 0,
						minChunks: 2,
						priority: 2,
						reuseExistingChunk: true,
						enforce: true
					}
				}
			}
		};

		config.module.rules.filter(rule => {
			return rule.test.toString().indexOf("scss") !== -1;
		}).forEach(rule => {
			rule.oneOf.forEach(oneOfRule => {
				oneOfRule.use.splice(oneOfRule.use.indexOf(require.resolve('sass-loader')), 0,
					{loader: require.resolve("css-unicode-loader")})
			})
		});
	},

	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/styles/index.scss";`
			}
		}
	},

	chainWebpack: config => {
		config.resolve.symlinks(true);

		config.resolve.alias
			.set("@", resolve("src"))
			.set("@mock", resolve("mock"))
			.set("@directives", resolve("src/directives"))
			.set("@filters", resolve("src/filters"))
			.set("@locale", resolve("src/locale"))
			.set("@mixins", resolve("src/mixins"))
			.set("@assets", resolve("src/assets"))
			.set("@store", resolve("src/store"))
			.set("@components", resolve("src/components"))
			.set("@styles", resolve("src/styles"))
			.set("@utils", resolve("src/utils"));

		fs.readdirSync(resolve("src/pages")).forEach(function (fileName) {
			const path = resolve(`src/pages/${fileName}`);
			if (fs.statSync(path).isDirectory()) {
				config.resolve.alias.set(`@${fileName}`, path);
			}
		});

		if (isProduction) {
			// 清除css，js版本号
			config.output.filename("js/[name].js").end();
			config.output.chunkFilename("js/[name].js").end();

			// eslint-disable-next-line no-unused-vars
			config.plugin("extract-css").tap(options => [
				{
					filename: `css/[name].css`,
					chunkFilename: `css/[name].css`
				}
			]);

			Object.keys(pages).forEach(key => {
				config.plugin("html-" + key).tap(options => {
					options[0].cdn = PRODUCTION_CONFIG.cdn;
					return options;
				});
			});
		}

		config
			.plugin("ignore")
			.use(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)); // 删除moment 多余语言包

		return config;
	},

	parallel: require("os").cpus().length > 1,

	devServer: {
		open: true,
		host: projectConfig.host || process.env.APP_SERVER_HOST,
		port: projectConfig.port || process.env.APP_SERVER_PORT,
		disableHostCheck: true,
		overlay: {
			warning: false,
			errors: true
		},
		proxy: proxy
	},

	// pluginOptions: {
	// 	"style-resources-loader": {
	// 		preProcessor: "scss",
	// 		patterns: [resolve("src/styles/index.scss")]
	// 	}
	// }
};

configs.publicPath = isProduction ? `${process.env.PUBLISH_PATH}/${config.team}/${projectName}/${TIMESTAMP}` : `/`;

module.exports = configs;
