# 简单

> Rollup 是一个JavaScript`模块`打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序

### CJS, AMD, UMD, ESM, System 和 IIFE 分别代表什么

- `cjs` (CommonJS) — 适用于 Node 和其他打包工具（别名：commonjs）。
- amd (Asynchronous Module Definition，异步模块化定义) — 与 RequireJS 等模块加载工具一起使用。
- `umd` (Universal Module Definition，通用模块化定义) — amd，cjs 和 iife 包含在一个文件中。
  UMD 被设计用于任何地方 — 包括服务端和浏览器端。它试图兼容目前最流行的 script 加载器（如 RequireJS）。在许多情况下，它使用 AMD 作为基础，且兼容 CJS。然而兼容增加了一些复杂度，使得读写变得更加困难。
- `es` — 将 bundle 保存为 ES 模块文件。适用于其他打包工具，在现代浏览器中用 <script type=module> 标签引入（别名：ems, module）。比较适合常见打包浏览器模式。
- system — SystemJS 加载器的原生格式 （别名：systemjs）。
- iife — <script> 标签引入的自执行函数。如果你想为你的应用创建一个包，你需要用到的可能就是这种。

[来源](https://segmentfault.com/a/1190000040720081)


### 定位
es module 打包器，细碎文件打包。更加小巧，主要定位esm打包器，初衷提供一个高效性能高的esm打包器，主要在类库中使用过比较多。
webpack HMR等都无法实现。

- 默认会开启tree-shaking 的功能
- 插件是唯一的扩展方式
  

### 简单命令

```node
// yarn 会默认去寻找可执行脚本
// 不指定默认会默认展示当前的所有命令格式
yarn rollup 

// 默认会使用rollup.config.js
yarn rollup -c
```

`rollup.config.js` 这个文件`rollup`会单独进行处理，支持es modules等写法，运行的`node`环境。

### 插件

自身知识esmodule功能的合并打包，如果项目中使用到了更高级的功能资源加载，导入cjs模块，ts等，只能使用插件的方式进行扩展。
相比webpack更加简单一些。

#### 导入json的
```js
import json from "rollup-plugin-json";
export default {
   input: 'src/app.js',
   output: {
      file: 'dist/bundle.js',
      format: 'iife'
   },
   plugins:[
      // 将结果导入
      json()
   ]
}
```
app.js 中使用，其中也处理tree-shaking，没有调用的地方都没有加载。

```js
// rollup-config.js
import json from "rollup-plugin-json";
export default {
   plugins:[
      json(), // 原理是打包的时候在校验输出文件流的时候验证json文件并且绑定输出
   ]
}
// app.js
import { name,version  } from "../package.json";
console.log(name, version);
```

#### rollup-plugin-node-resolve
默认只能按照文件路径加载，node_modules中第三方的包无法直接按照名称进行加载，且`rollup` 只能处理`es module`。
```js
// rollup-config.js
import resolve from 'rollup-plugin-node-resolve';
export default {
   plugins:[
      resolve(),
   ]
}
// app.js
import {join} from 'lodash-es';
console.log(join([1,2,3,4],'@'))
```


### 加载cjs模块

`rollup` 设计值处理 `es module` 打包，默认不支持`commonjs` , 但是大量就模块使用的`cjs`实现，因此需要使用插件 `rollup-plugin-commjs` 文件。
引入结果就会以对象的形式将cjs文件导入到使用的文件中。
```js
// rollup-config.js
import commonjs from 'rollup-plugin-commonjs';
export default {
   plugins:[
      commonjs(),
   ]
}
// app.js 打包完data就会变成一个对象
import data from './cjs'
log(data.getVersion())

//cjs/index.js
module.exports = {
    name:"jc",
    getVersion: function(){
        return this.name;
    }
}
```

#### 代码拆分 Dynamic imports 支持
按需导入，内部会自动处理拆分和分包。需要支持配置 format=AMD 浏览器环境，iife 自执行无法拆包，且需要执行dir, 而不是特定的文件，一般会有下面两个错误。

[!] RollupError: Invalid value "iife" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.

也就是说动态加载一般是web端使用，UMD 和 IIFE 一般打包输出是在一个文件中，因此肯定不支持拆分。

```js
// rollup.config.js
  {
    output: {
      // file: 'dist/bundle.js',
      // format: 'iife'
      dir: 'dist',
      format: "amd"
   }
  }
// app.js
import("./logger").then(({ log })=>{
    log("This is dynamic import infomation!");
})
```
打包完会产生两个文件，一个 `app.js` 和 ` index.xxx.js`。

#### 多入口打包

重复部分会自动提取到公共文件中。 由于是多入口，因此内部会使用代码拆分
```js
// rollup.config.js
export default {
   input: ['src/app.js','src/app2.js'], // 也支持对象的形式
   output: {
      dir: 'dist',
      format: "es"
   }
}

// app.js
import { info,log } from "./logger/index";
import fetchApi from './fetch'
fetchApi(1).then( data=>{
    log(data)
})

// app2.js
import { info,log } from "./logger/index";
import fetchApi from './fetch'
fetchApi(2).then( data=>{
    log(data)
})
```
最后打包完`app.js` 和 `app2.js`还有一个是混合的文件用公共的部分。



### 优缺点
优点：打包简单，代码方便阅读

缺点：
- 开发服务器不能实现模块热更新，调试繁琐
- 浏览器环境的代码分割依赖amd，es模块可以自动支持
- 加载第三方模块比较复杂

因此特别是和类库。`react`和`vue`的一些基础类库中基本都是用`rollup`。更专业的工具做更专业的事情。

应用程序应该选择`webpack`。