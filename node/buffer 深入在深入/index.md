

# 概念和理解？

> Buffer类作为Node.js API，负责操作二进制数据，是典型的js和c++模块结合的一个方法。俗称缓冲区。

Buffer类似js中的数组，但是它的元素是16进制的两位数，即为0到255的数值(8位无符号整形`Uint8Array`).[FF是最大的16进制两位数，即255]。

我们已经提到，数据流是数据从一个点移动到另一个点，但是它们究竟是如何移动的呢?

通常数据的移动是为了处理或读取数据，并根据数据做出决策。在这个过程中，可能需要数据到达一个最小量或者最大量才能进行处理。因此，如果数据到达的速度快于进程消耗数据的速度，那么多余的数据需要在某个地方的等待来处理。另一方面，如果进程消耗数据的速度快于数据到达的速度，那么早到达的少数数据需要等待一定数量的数据到达，然后再发送出去进行处理。

那个“等候区”就是Buffer!它是计算机中的一个小物理位置，通常位于`RAM`中，数据在`RAM`中被临时收集、等待，并最终发在流过程中送出去进行处理。

我们可以把整个`stream`和`buffer`过程看做一个汽车站。在某个汽车站，汽车直到有一定数量的乘客或者是一个特殊的时间才可以发车。此外，乘客可能在不同的时间以不同的速度到达。无论是旅客还是汽车站都不能控制旅客到达车站的时间。提前到达的乘客需要等汽车发车。当有些乘客到达时，乘客已经满员或者汽车已经离开，需要等待下一辆汽车。

无论什么情况，总有一个等待的地方。这就是`Node.js`的`Buffer`! 

`js`不能控制数据到达的速度或时间，也不能控制流的速度。它只能决定何时发送数据。如果还没有到时间，`Node.js`将把它们放在`buffer`中，即`RAM`中的一个小位置，直到将它们发送出去进行处理为止。

一个典型的例子是，当你在观看优酷视频时，可以看到`buffer`在工作。如果你的网速连接足够快，流的速度将足够快，可以立即填满`Buffer`并发送出去进行处理，然后再填入另一个`Buffer`，然后发送出去，再发送一个，再发送一个，直到流完成为止。

反之，在处理了第一组到达的数据后，视频会被卡主，这意味着程序正在收集更多的数据，或者等待更多的数据到达。当buffer被填满并处理后，播放器会继续播放视频。在播放的同时，更多的数据将继续到达并`在buffer`中等待。



# buffer使用？

### 1. Bit、 Byte、KB、MB、GB之间的换算
> 因为buffer总是会涉及到字节大小等转换，内存的申请,申明下大小转换关系。

```js
    1 Byte = 8 Bits（即 1B=8b）
    1 KB = 1024 Bytes
    1 MB = 1024 KB
    1 GB = 1024 MB
```

- Bit意为“位”或“比特”，是计算机运算的基础，属于二进制的范畴；
- Byte意为“字节”，是计算机文件大小的基本计算单位；

这两者应用的场合不同。通常用bit来作数据传输的单位，因为物理层，数据链路层的传输对于用户是透明的，而这种通信传输是基于二进制的传输。在应用层通常是用byte来作单位，表示文件的大小，在用户看来就是可见的数据大小。比如一个字符就是1byte,如果是汉字，则是2byte

**简答实战一下：**

```js
/**
 * 单位为字节格式为 MB 输出
 */
const format = function (bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
};

const print = function () {
   const memoryUsage = process.memoryUsage();
   console.log(
    JSON.stringify({
      rss: format(memoryUsage.rss),
      heapTotal: format(memoryUsage.heapTotal),
      heapUsed: format(memoryUsage.heapUsed),
      external: format(memoryUsage.external),
    })
  );
};
```
输出信息是： `{"rss":"93.06 MB","heapTotal":"4.26 MB","heapUsed":"2.63 MB","external":"0.90 MB"}`。
具体内存等信息请参考另外一篇博文：*v8 内存-node 内存-我到底大不大*

### 2. 创建和操作buffer
`Node.js`在处理流期间会自动创建`buffer`，我们也可以通过`Nodejs`提供的API自己创建`buffer`。根据你的需求，这里有几种不同的方法可以创建`buffer`。

`buffer`提供了 `Buffer.from`、`Buffer.alloc`、`Buffer.allocUnsafe`、`Buffer.allocUnsafeSlow`四个方法来申请内存。

```js
// 创建了一个全新的，可以容纳10个字节的缓冲区
const buf1 = Buffer.alloc(10);

const buf2 = Buffer.from("hello buffer")

// 第二个参数指定编码的格式
const buf3 = Buffer.from('10'); // <Buffer 31 30>
const buf2 = Buffer.from('10', 'utf8');  // <Buffer 0a>
```
当创建成功buffer后，你就可以开始和它进行交互了。

```js
// 查看buffer的结构
buf1.toJSON()
// { type: 'Buffer', data: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] }

buf2.toJSON()
//{ type: 'Buffer',data: [ 104, 101, 108, 108, 111, 32, 98, 117, 102, 102, 101, 114 ]}

buf1.length // 10
buf2.length // 12

// 写操作
buf1.write("Buffer really rocks!")

// decode
buf1.toString() // 'Buffer rea'
// 因为buf1创建时只分配了10byte的空间。超过的将不会被存储。
```

字符串与`buffer`的转换。

```js
const buf = Buffer.from('好未来JS', 'utf8');

console.log(buf); // <Buffer e5 a5 bd e6 9c aa e6 9d a5 4a 53>
console.log(buf.length); // 11，最后后两个字节是 "JS"，前端三个单个长度是3

console.log(buf.toString('utf8')); // 好未来JS
```

### 3. api列表

- `Buffer.alloc(size[, fill[, encoding]])`  用来申请指定大小的内存空间
`size`，指定buffer的长度，但不能超过buffer.kMaxLength，若不是数字则报错。
`fill`，指定初始化buffer的值，默认为0。
`encoding`，如果`fill`是字符串，则该参数指定fill的编码，默认`'utf8'`。

- `Buffer.allocUnsafe(size)` size参数指定`buffer`的大小，该方法返回一个没有初始化的buffer，因此可能还保留有敏感的数据，造成信息的泄漏，建议使用`buffer.fill(0)`函数初始化`buffer`。
```js
const buf = Buffer.allocUnsafe(10);
// Prints: (contents may vary): <Buffer a0 8b 28 3f 01 00 00 00 50 32> 可以看出是有数据的！
console.log(buf);

buf.fill(0);

// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buf);

```
- `Buffer.allocUnsafeSlow(size)` 直接通过c++进行内存分配；不会进行旧值填充。除了这两点与`Buffer.allocUnsafe(size)`的其他特性一样。
```js
// 从c++模块层面直接申请内存
const buf4 = Buffer.allocUnsafeSlow(10);
console.log(buf4);  //<Buffer 00 00 00 00 00 00 00 00 86 00> // 不一定是什么数据
```
- `Buffer.from(array)` 接收一个数组作为参数，会将数组内的值转化为16进制。
```js
const bufArr = Buffer.from([1,2,3]);
console.log(bufArr);  // <Buffer 01 02 03>
```
- `Buffer.from(arrayBuffer[, byteOffset[, length]])`


# buffer 和内存

`Buffer`对象的内存分配不是在`V8`的堆内存中，而是Node在C++层面实现内存申请的。然后申请来的内存是在`JavaScript`的层面上进行管理的。

为了高效的管理内存，Node采用了`slab`动态内存管理机制。大可不必在乎这几个字符是什么意思，你就简单的去理解成：slab就是一个分配好的内存区域，也就是你使用Buffer对象传入一个指定的size就申请了一块内存。然后slab具有下面的3种状态：

- **empty**: 初次被创建，还没有被分配数据
- **partial**: 部分空间被分配，并没有完全分配
- **full**: 完全被分配

Node会根据当前申请的内存大小将`Buffer`对象进行分类，如果（这里以第一次申请为例）申请的内存大小小于`4k`，那么就会存入初始化的slab单元中，即查阅各种资料所谓的`8k`池，当接下来继续申请的内存大小仍然小于4k并且当前第一个初始化的8k池空间足够的情况下就会继续存入第一个初始化的8k池。

打个比方：如果被初始化的`8k`池的空间剩余`2k`，这个时候再去申请一个大于2k并且小于4k的内存空间，就会去新申请一个slab单元空间，上次初始化的slab单元的剩余2k内存就会被浪费掉，无法再使用。

如果申请的内存大于4k那么就不会走8k池，而是node直接通过C++层面去申请一个独占的slab单元空间。

最后说明一下：无论是哪种情况，最后得到的`Buffer`对象都是`JavaScript`层面的，也就是可以被`V8`的垃圾回收机制所管理。这中间其实`Node`做了大量的工作，最主要的就是把JS和C++结合起来。

以下是使用8k池的API和条件：

`Buffer.allocUnsafe` 传入的数据大小 (0 < size < 4 * 1024)
`Buffer.concat` 传入的数据大小 (0 < size < 4 * 1024)
`Buffer.from` 参数不为一个 ArrayBuffer 实例 并且 传入的数据大小 (0 < size < 4 * 1024)

**总结：**

- 在初次加载时就会初始化 1 个 8KB 的内存空间，v12.x/lib/buffer.js#L156 源码有体现

- 根据申请的内存大小分为 小 Buffer 对象 和 大 Buffer 对象。小 Buffer （小于 4kb ）情况，判断这个 slab 剩余空间是否足够容纳。若足够就去使用剩余空间分配，偏移量会增加。若不足，就调用 createPool 创建一个新的 slab 空间用来分配。

大 Buffer （大于 4kb ）情况，直接 `createUnsafeBuffer(size)` 创建。
之所以要判断区别大对象还是小对象，就只是希望小对象不要每次申请时都去向系统申请内存调用。

**不论是小 Buffer 对象还是大 Buffer 对象，内存分配是在 C++ 层面完成，内存管理在 JavaScript 层面，最终还是可以被 V8 的垃圾回收标记所回收，回收的是 Buffer 对象本身，堆外内存的那些部分只能交给 C++。**

# 应用场景
文件与网络 `I/O`，与流 `Stream` 密不可分，只是 `Stream` 包装了一些东西，不需要开发者手动去创建缓冲区。当然下面直接这样读文件，Chrome V8引擎限制了所能使用的内存极限（64位为1.4GB，32位为1.0GB），得需要用流。

```js
const fs = require("fs");
fs.readFile("./mv.jpg", (err, res) => {
  if (err) throw err;
  console.log("====", res.length, Buffer.isBuffer(res), res); // buffer true
});
```


# 参考文章
- https://www.freecodecamp.org/news/do-you-want-a-better-understanding-of-buffer-in-node-js-check-this-out-2e29de2968e8/
- https://www.cnblogs.com/copperhaze/p/6232661.html
- es6 Arraybuffer 深入理解和 https://www.cnblogs.com/jixiaohua/p/10714662.html
