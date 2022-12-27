import Vue from 'vue'
import BigImg from './index.vue'

let bigImgNode = null // 存储loading节点元素
const bigImgConstructor = Vue.extend(BigImg)

const install = function (Vue) {
  Vue.prototype.$BigImg = function (type, url, event, options) {
    if (!bigImgNode) {
      bigImgNode = new bigImgConstructor()
      document.body.appendChild(bigImgNode.$mount().$el)
    }

    if (type === 'hide') {
      bigImgNode.show = false
    } else {
      if (!url) {
        return
      }

      Object.assign(bigImgNode, {
        options,
        url,
        event,
        show: true
      })
    }
  };

  ['show', 'hide'].forEach(function (type) {
    Vue.prototype.$BigImg[type] = function (url, event, options = { width: '200px', height: '200px', }) {
      return Vue.prototype.$BigImg(type, url, event, options)
    }
  })
}

export default install
