学习资料

1. [官网](https://rollupjs.org/guide/en/#config-intellisense)

2. [Use Rollup to create a JavaScript library for use anywhere](https://blog.csdn.net/qq_36264495/article/details/118875648)

3. [一文带你快速上手Rollup](https://juejin.cn/post/6869551115420041229#heading-23)

4. [# 关于babel的详细解读(精华又通俗)](https://juejin.cn/post/6844904199554072583)


整体发现rollup使用更加细颗粒度和简单，非常适合非常简单的包工具等开发。
[插件开发](https://zhuanlan.zhihu.com/p/424129694)类似webpack 

```js
export default function myExample () {
    return {
      name: 'my-example', // this name will show up in warnings and errors
      resolveId ( source ) {
        if (source === 'virtual-module') {
          return source; // this signals that rollup should not ask other plugins or check the file system to find this id
        }
        return null; // other ids should be handled as usually
      },
      load ( id ) {
        if (id === 'virtual-module') {
          return 'export default "This is virtual!"'; // the source code for "virtual-module"
        }
        return null; // other ids should be handled as usually
      }
    };
  }
```

