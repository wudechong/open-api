import msgboxVue from './index.vue';

const install = function (Vue) {
  let MessageBoxInstance = Vue.extend(msgboxVue);
  let currentMsg;

  const initInstance = () => {
    // 实例化vue实例
    currentMsg = new MessageBoxInstance();
    let msgBoxEl = currentMsg.$mount().$el;
    document.body.appendChild(msgBoxEl);
  };

  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$cMsgBox = {
    show (options) {
      if (!currentMsg) {
        initInstance();
      }

      if (typeof options === 'string') {
        currentMsg.content = options;
      } else if (typeof options === 'object') {
        Object.assign(currentMsg, options);
      }

      return currentMsg.show().then(val => {
        currentMsg = null;
        return Promise.resolve(val);
      }).catch(err => {
        currentMsg = null;
        return Promise.reject(err);
      });
    }
  };
};

export default install;