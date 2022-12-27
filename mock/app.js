const fs = require('fs')
const {URL} = require('url')

function formatJSON(jsonStr) {
	return JSON.stringify(JSON.parse(jsonStr), null, 2)
}

function mockcontent(url, method, path) {
	return `Mock.mock(RegExp('^${url}'), '${method.toLocaleLowerCase()}', require('./sample/${path}'))`
}

function readHarFile(path) {
	return fs.promises.readFile(path, 'utf8')
}

function settleFile(fileContent) {
	const xhrs = JSON.parse(fileContent).log.entries.filter(
		d => d._resourceType === 'xhr' && d.response.status === 200
	)
	const paths = ['import Mock from "mockjs"'],
		texts = {}
	for (const item of xhrs) {
		let {method, url} = item.request
		url = new URL(url)
		const fileName = url.pathname.replace(/\//g, '-').slice(1)
		const text = item.response.content.text
		if (!texts[fileName] || texts[fileName].length < text.length) {
			texts[fileName] = text
			paths.push(mockcontent(url.pathname, method, fileName))
		}
	}
	return {paths: paths.join('\n'), texts}
}

function writeFile(config) {
	return Promise.all(
		[
			fs.promises.writeFile('./mock.js', config.paths),
			Object.entries(config.texts).map(d => fs.promises.writeFile(`./sample/${d[0]}.json`, formatJSON(d[1])))
		].flat()
	)
}

readHarFile('./localhost.har')
	.then(settleFile)
	.then(writeFile)
	.catch(console.log)
