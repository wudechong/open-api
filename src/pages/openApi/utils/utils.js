import {http} from "calf-vue";

const utils = {
	// 获取下载/导入/导出url
  getDoc() {
    if (window.location.host.includes('localhost')) {
      return {url: ''};
    }
    return http.get('/erp/supply/doc/url/get')
  },
};

export default utils;