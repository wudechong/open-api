## 背景

- ERP前端子项目过多难以管理。
- 各个前端子项目之间通过Copy来复用代码，很不合理。
- 如果将所有前端子项目简单的合并成一个项目，则启动和打包会非常难，且很难跟ERP各Java Web项目的发布节奏协作。



## 新框架的主要特性

- 支持多个子项目的任意拆分启动和打包。
  这样就可以将所有ERP前端代码合并到一个项目中，实现代码复用的同时，解决启动过慢以及难以与Java Web项目的发布节奏同步的问题。
- 提供分级的Component、Store、Mixin、Locale等，优化代码复用的模式。



## 规范

- Vue中的`<template>`部分严重推荐使用 [pug](https://www.pugjs.cn/api/getting-started.html) 编写，而不是直接使用HTML。考虑到历史原因，此规范并非强制。
- Vue中的`<style>`和独立的css文件必须使用scss编写。
- pages目录下的文件可以依赖pages目录外的文件，但任何情况下pages目录外的文件都不能依赖pages目录下的文件！
- 在Component、Store、Mixin、Locale等分级资源时，因首先考虑将内容放在pages下的私有目录中，只将那些确实有必要提升为项目级复用的内容提取到pages外的全局目录中。



## 项目初始化

- 配置npm私服，详见[配置npm私服](https://hupun.yuque.com/ly84gg/uap8q0/czd92w)
- 执行 `npm i`



## 项目启动和打包

不同于普通的Vue项目，此项目在启动或构建时必须指定子项目的名称。每个子项目对应 pages 目录下的一个子目录。

例如要启动其中的demo1子项目时，可以执行如下命令...

```
npm run serve demo1
```



如果要构建一个子项目，则是...

```
测试打包并上传oss
npm run build:upload demo
灰度/线上打包，目前上传由jerry负责，改版本由相应后端负责。（后期统一规范化）
npm run build-p demo
```


我们可以通过 projects.config.js 文件来为各个子项目配置特别的参数，例如启动端口号、代理目标地址等等。

我们也可以在 projects.config.js 中添加一个虚拟的子项目，已达到一次启动或打包多个子项目的目的。

例如，我们可以在projects.config.js添加如下一段，表示要通过 all（这个名字可以随便定义） 这个虚拟的子项目同时启动demo1和demo2这两个子项目。

```js
module.exports = {
  ... ...,
  all: {
    entries: ["demo1", "demo2"],
    serviceTarget: "http://localhost:8081"
  }
};
```

每个子项目支持的属性包括：
* port: 启动端口，默认值可以在`.env`文件中通过`APP_SERVER_PORT`修改。
* env: 环境变量，此属性的值是一个JSON，其中可以包含若干个环境变量的配置。
* serviceTarget: 服务代理的默认目标地址。
* proxy: 代理设置，请参考vue-cli的proxy配置方式。
  另外，此处的proxy在vue-cli的基础上做了少量的增强...
  * 不必为每一个路径单独定义`target`，系统会自动使用`serviceTarget`的配置作为该`target`。
  * 已自动将`changeOrigin`属性的默认值设置为true。
  * 支持一次性的定义多个路径，多个路径之间可以以`;`或`,`分隔开。
  * 已默认包含`/service/`，`/web/`, `/erp/`, `/calf/`这四个路径的代理配置。

以下是proxy配置的一些例子...
```js
module.exports = {
  demo1: {
    serviceTarget: "http://localhost:8081",
    proxy: {
      "/service/ , /api/": {}
    }
  }
};
```

patch-package给开发者提供了通过打“补丁”的方式，使得重新安装依赖包时能够保留之前对第三方依赖包的修改的一种解决方案,对本项目可以对calf-vue打补丁的方式，不需要更新版本
```js
npx patch-package calf-vue 保存当前依赖修改状态，其他人需要时使用npm install命令即可
```
https://juejin.cn/post/7010649333729558535

完整版文档清参考：
https://hupun.yuque.com/ly84gg/uap8q0/pziy62


```js
"build-p:upload": "vue-cli-service build --mode production && npm run upload-production :",
```
