const items = require("./trades");
const pics = require("./goodsPics");
const pageSize = 2000;
const data = [];

while (data.length < pageSize) {
	for (const item of items.slice(0, (pageSize - data.length))) {
		if (item.orderSimpleVOS) {
			for (const order of item.orderSimpleVOS) {
				if (!order.pic) order.pic = pics[Math.trunc(Math.random() * pics.length)];
			}
		}
		data.push(item);
	}
}

module.exports = {
	"code": 200,
	"data": {
		"hasMore": false,
		"$pageSize": pageSize,
		"$pageNo": 1,
		"$from": 0,
		"$limit": pageSize,
		"$data": data,
		"$entityCount": 7355
	}
};