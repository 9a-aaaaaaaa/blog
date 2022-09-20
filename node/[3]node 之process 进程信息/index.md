

![37f600086cc634c02888.webp](1.webp)

> `process` 对象是一个全局变量，提供了有关当前 `Node.js`进程的信息并对其进行控制。`nodejs` 文档的描述，简而言之，就是当前整个进程的信息描述集合。自身也是 `EventEmitter`的实例。

### 1 进程的退出码

- **0** 正常地退出。
- **1** 未捕获的致命异常：有未捕获的异常，并且没被域或 `uncaughtException`事件句柄处理。
- **5** 致命的错误：在 V8 中有致命的错误。 通常会以 FATAL ERROR 为前缀打印消息到 stderr。
- **8**：未被使用。在之前的 Node.js 版本中，退出码 8 有时候表示未被捕获的异常。
- **9** 无效的参数：指定了未知的选项，或者没给必需要的选项提供值。
- **128** 信号退出：如果 Node.js 接收到致命信号, 比如 SIGKILL 或 SIGHUP，则其退出码会是 128 加上信号码的值。 这是标准 POSIX 的实践，因为退出码被定义为 7 位整数，并且信号退出设置了高位，然后包含信号码的值。 例如，信号 SIGABRT 的值为 6，因此期望的退出码会是 128 + 6 或 134。

### 2: 常用的属性列表

- **process.env**：环境变量，例如通过 **process.env.NODE_ENV** 获取不同环境项目配置信息。

`win`常见的设置环境变量:`package.json`文件新增：
```js
"build": "set NODE_ENV=production && node app.js"
```
`mac/linux`下设置：
```js
 // 1: 检测
 echo $NODE_ENV
// 2: 添加环境变量
export NODE_ENV=production
// 3: 删除环境变量
unset NODE_ENV

```
ps: 一般为了通用性能，会使用一些第三方的库来设置环境变量，eg:[`cross-env` ](https://www.jianshu.com/p/e8ba0caa6247)
- `process.argv`:属性会返回一个数组，其中包含当 Node.js 进程被启动时传入的命令行参数
例如：下面 process1.js:

    process.argv.forEach(function (item) {
      console.log("====", item);
    });
    
    // 在命令行执行：node .\process.js anikin qiuyanlong 
    // ==== E:\node\node.exe   ===  process.execPath
    // ==== D:\nodeMemory\process.js  // 正被执行的 js文件的路径
    // ==== anikin  
    // ==== jack
- `process.nextTick`：这个在 `Event Loop` 的文章专门介绍
- `process.pid`：获取当前进程id
- `process.ppid`：当前进程对应的父进程
- `process.cwd()`：方法会返回 Node.js 进程的当前工作目录 === __dirname
- `process.platform`：获取当前进程运行的操作系统平台
- `process.uptime()`：当前进程已运行时间，例如：pm2 守护进程的 uptime值
- 进程事件：`process.on('uncaughtException', cb) `捕获异常信息，`process.on('exit', cb）`进程退出监听
- `process.execPath` 属性会返回启动 `Node.js` 进程的可执行文件的绝对路径
- 三个标准流：`process.stdout 标准输出`、`process.stdin 标准输入`、`process.stderr 标准错误输出`。
- `process.exit()`: 方法以退出状态 code 指示 Node.js 同步地终止进程
- `process.kill(pid[, signal])`: signal 要发送的信号，类型为字符串或数字。默认值: 'SIGTERM'

### 3: stdout，stdin，stderr 标准的输入输出事件
三者均指向系统的io。

#### stdout 标准输出
`stdout`属性指向标准输出（文件描述符1）。它的`write`方法等同于`console.log`，可用在标准输出向用户显示内容。

```js
console.log = function(d) {
  process.stdout.write(d + '\n');
};

// 将a.txt文件的内容导向系统标准输入流，在控制台就可以查看到输出内容
fs.createReadStream("./a.txt").pipe(process.stdout);

```

#### stdin 标准输入
`process.stdin` 属性会返回连接到 `stdin (文件描述符 0)` 的流。 它是一个 `net.Socket`（也就是 Duplex 流），除非文件描述符 0 指向文件（在这种情况下它是一个 Readable 流）
由于`stdin`和`stdout`都部署了`stream`接口，所以可以使用`stream`接口的方法。

```js
process.stdout.write("请输入用户名：");  // zhangsan
process.stdin.on("data", (input) => {
  console.log("xxx", Buffer.isBuffer(input), input);  // true  <buffer>
  var ainput = input.toString().trim();
  console.log("输入的值是：", ainput);  // 张三
  process.exit();
});
```
但是`node`现在不推荐上面的写法，可以按照下面这个写法：

```js
process.stdout.write("请输入用户名：");
//不设置编码则data数据就是buffer类型的数据
process.stdin.setEncoding("utf-8"); 

process.stdin.on("readable", function (input) {
  let chunk = process.stdin.read();
  if (chunk) {
    process.stdout.write("=====" + chunk);
  }
});

process.stdin.on("end", function (e) {
  process.stdout.write("====", end);
});
```
> 为什么无法触发 process.on('end')事件呢？
`'end'` 事件只有在数据被完全消费掉后才会触发。 要想触发该事件，可以将流转换到流动模式，或反复调用 stream.read() 直到数据被消费完。

```js
process.stdout.write("请输入用户名：");
process.stdin.setEncoding("utf8");
process.stdin.on("readable", function () {
  let chunk = process.stdin.read();
  if (typeof chunk === "string") {
    chunk = chunk.slice(0, -2); // 回车符号占据2位 \t
    process.stdout.write(`stringLength:${chunk.length}\n`);
  }
 
   // 什么不输入的时候就直接触发
  if (chunk === "") {
    return process.stdin.emit("end");
  }

  if (chunk !== null) {
    process.stdout.write(`========data: ${chunk}\n`);
  }
});

process.stdin.on("end", function (e) {
  process.stdout.write("end");
});
```
#### stderr 指向标准错误（文件描述符2）。








