import BigImg from './BigImg';


const components = {
  BigImg,
}


const install = function(Vue) {
  // 注册组件
  for (const key in components) {
    Vue.use(components[key])
  }
};
export default install
