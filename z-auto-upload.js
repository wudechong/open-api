/**
 * 万里牛-白鹭前端静态资源自动上传OSS脚本
 * 1、一般放在根目录下，因为dist一般也在根目录下
 * 2、package.json 稍作修改，比如增加下面这两条命令
 * 3、运行 npm run build:upload 就实现了一键打包上传通知
 */
// "build:upload": "vue-cli-service build && npm run upload :", xxx-项目名
// "upload": "node ./z-auto-upload.js hpublic",
// npm run build:upload:xxx => vue-cli-service build && npm run upload : xxx
const fs = require('fs')
const path = require('path')

const glob = require('glob')
const OSS = require('ali-oss')
const chalk = require('chalk')
const DingdingBot = require('dingtalk-robot-sender')

const childProcess = require('child_process')

const getBranch = () => {
	return new Promise((resolve, reject) => {
		childProcess.exec(`git symbolic-ref --short HEAD`, {encoding: 'utf-8'}, (error, stdout, stderr) => {
			if (error) {
				return reject(error)
			}
			resolve(stdout.replace(/\s/g, ''))
		})
	})
}

const getName = () => {
	return new Promise((resolve, reject) => {
		childProcess.exec(`git config user.name`, {encoding: 'utf-8'}, (error, stdout, stderr) => {
			if (error) {
				return reject(error)
			}
			resolve(stdout.replace(/\s/g, ''))
		})
	})
}

const itemName = process.argv[4] // 目标文件夹  ['D:\\nodejs\\node.exe', 'E:\\work\\erp-view\\z-auto-upload.js','hpublic',':','publish']
if(!itemName) return
const buildPath = path.resolve(__dirname, 'dist/' + itemName) // build 以后静态资源 output 的路径
const buildDir = fs.readdirSync(buildPath) // 需要上传 OSS 的静态资源目录
const lastBuildName = buildDir[0] // 取最新打包的文件夹
const bucketName = process.argv[2] // OSS 的 bucket name


const ossPath = 'erp' + '/' + itemName // oss 对应的项目路径

/** OSS 配置 */
const Client = new OSS({
	region: 'oss-cn-hangzhou',
	accessKeyId: 'FQqTt18MTPQHUPIs',
	accessKeySecret: 'cZf0T2I8EtrpK9bqmgddPbvFK3FxiM',
	bucket: bucketName
})

// 开始读取 dist 下最新的静态资源，并上传、通知
glob('**/*.*', { cwd: buildPath + '/' + lastBuildName, nodir: false }, (err, files) => {
	if (err) {
		console.log(err)
	} else {
		const start = new Date()
		console.log(chalk.green(`${bucketName.includes('dev') ? '测试' : '生产'}环境开始打包部署, 共${files.length}个文件`))
		console.log(chalk.green(`请耐心等待，正在上传中...`))
		let arr = files.map((fileName) => {
			return {
				localPath: buildPath + '/' + lastBuildName + '/' + fileName,
				ossFileName: ossPath + '/' + lastBuildName + '/' + fileName
			}
		})
		// 开始上传
		Promise.all(
			arr.map((file) => {
				return Client.put(file.ossFileName, fs.readFileSync(file.localPath))
			})
		)
			.then((res) => {
				const ms = new Date() - start
				console.log(chalk.green(`${lastBuildName} 版本上传成功，用时${ms}ms`))
				/**如需要，可以发送钉钉通知**/
				sendVerson(lastBuildName)
			})
			.catch((e) => console.log(e))
	}
})

/** 发送钉钉消息 */
async function sendVerson(version) {
	const robot = new DingdingBot({
		webhook: `https://oapi.dingtalk.com/robot/send?access_token=6e17f3f892de0e4aa5d337a30ea8282a5cef50c15e6b299eecbba4fcdcc4154e`, // 群通知,目前配置在个人群
		// secret: `钉钉群里的机器人配置`
	})

	let localBranch = '', localName = '';

	try {
		localBranch = await getBranch()
		localName = await getName()
	} catch (e) {
		/* handle error */
		console.log(e)
	}
	let textContent = {
		msgtype: 'text',
		text: {
			content: `测试环境分支:(${localBranch}),${localName ? "操作人:"+localName + ',' : ''}前端最新版本号：${itemName}:${version}`
		},
		at: {
			atMobiles: [], // 需要艾特的群成员的手机号
			isAtAll: false
		}
	}
	robot.send(textContent).then((res) => {
		if (!res.data.errcode) {
			console.log(chalk.bgGreen(`钉钉通知发送成功，任务全部完成！${itemName}:${version}`))
		} else {
			console.log(res.data)
		}
	})
}
