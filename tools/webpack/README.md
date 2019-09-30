<!--
 * @Descripttion: 
 * @version: 
 * @Author: qiuyanlong@100tal.com
 * @Date: 2019-09-15 17:40:39
 * @LastEditors: 如果您修改了该文件填写你的名字和时间
 * @LastEditTime: 2019-09-15 18:20:48
 -->
# 深入浅出webpack理解

> 又是新的一周，每周一篇博文，开始时间2019.9.15开始，一直想写一篇关于前端工具的文章，就是太费时间，太麻烦了。



- [1.前端工具发展](#前端模块化)
    - [1.1 模块化](##1.1commonjs)
    - [1.2 AMD 和 CMD](##1.2AMD和CMD)
- [2.webpack](#认识webpack)
    - [1.1 模块化](##2.1简单配置)



# 1. 前端工具的发展


## 1.1commonjs

`commonjs`通过`require`同步加载依赖模块，通过`module.exports`导出需要的接口，`nodejs`遵循该规范。分为`commonjs1`和`commonjs2`,区别
```js
 exports.xxx = xx;      // commonjs1
 module.exports = xx;   // commonjs2
```
因此一般指的是`commonjs2`。

## 1.2AMD和CMD

`AMD`->`requireJS`,异步方式加载依赖，也可并行加载，在浏览器端不转化也可以直接使用，缺点就是需要依赖库文件。

```js
// 定义一个模块
define('module',['jquery'],function(dep){
   return exports;
})

// 导入使用一个模块
require(['module'],function(module){

})
```
`CMD`->`seajs` CMD 推崇依赖就近
```js
define(function(require, exports, module) {
  var a = require('./a')
   a.doSomething()
  
   var b = require('./b') // 依赖可以就近书写
   b.doSomething()
})

```

# 认识webpack

## 2.1简单配置

