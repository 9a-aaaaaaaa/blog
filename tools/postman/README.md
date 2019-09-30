# postman 工具使用
> Postman是google开发的一款功能强大的网页调试与发送网页HTTP请求的工具。

## 简单介绍 postman 主要功能

- 模拟各种HTTP requests
  从常用的 GET、POST 到 RESTful 的 PUT 、 DELETE …等等。 甚至还可以发送文件、送出额外的 header。
- Collection 功能（测试集合）
- 内置测试脚本语言
- 设定变量与环境


## 记录点；

1： 左边面板中这里包含了`History`和`Collection`，右边的`Request Builder`面板上，还有两个按钮，`Pre-request Script`和`Tests`。

`Pre-request Script `
定义我们在发送request之前需要运行的一些脚本，应用场景主要是设置全局变量和环境变量. 假如我们设置的全局的变量是`{{key}} == 1`,但是了我们的数据是分批次进行返回的，那么我们就需要进行测试100条数据。在`Pre-request Script`里面添加`js`脚本.

```js
var temp = parseInt(postman.getGlobalVariable("key"));
temp += 1;
postman.setGlobalVariable("key", temp);
```
然后在集合里面`run`运行`100`次就可以看到。


`Pre-request Script`里面变化


`Tests `
定义发送Request之后，需要用脚本检测的内容，也就是Test case的内容。上面对应的我们进行测试一下.在`test`里面进行添加测试脚本运行。

```js
var temp = postman.getGlobalVariable("xhbxId");
tests["Body matches string"] = responseBody.has("\"_id\":\""+temp+"\"");
```
可以看到`test result`正确显示.



2. 设置 `Variables and Environment` 每一个`Collection` 可以单独`run`跑所有的测试接口，并且可以设置并发次数。

3. 创建 `mockserver`。很简单，可以实现一个mockserver数据格式，也方便前端进行调试。

4. 多终端显示语言调用格式。查看每一个`request`的右上角的`code`可以查看很多语言的支持格式，


```shell
curl -X GET \
  https://postb.in/1568429896111-7526705190539 \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: postb.in' \
  -H 'Postman-Token: ab1ddd6a-88af-437d-a129-9107acd0a0fc,6ea7bd42-b41d-4a69-9417-3f606c73965c' \
  -H 'User-Agent: PostmanRuntime/7.17.1' \
  -H 'cache-control: no-cache'
```

该请求是从[postbin](https://postb.in) 创建的,可以看到它的 curl请求格式如上面显示。


5. `curl` 简单实用

*curl url*

- *-X* GET/POST 指定 request 类型位 GET 请求 
- *-H* 'key:value' 指定 header 键值对,设置请求头部信息,多个字符串一定要进行字符串的拼接。
- *-d* '<字符串>'. (这个 -d 是 --data 的意思.)



修改上面为`POST`请求，刷新`postbin`就可以看到我们我们发送的请求过来了。

```shell
curl -X GET \
  https://postb.in/1568429896111-7526705190539 \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: postb.in' \
  -H 'Postman-Token: ab1ddd6a-88af-437d-a129-9107acd0a0fc,6ea7bd42-b41d-4a69-9417-3f606c73965c' \
  -H 'User-Agent: PostmanRuntime/7.17.1' \
  -H 'cache-control: no-cache' \
  -d '{"name":"qiuyanlong"}'  // 是`x-www-form-urlencoded`提交数据
```

关于`POST`请求需要知道的几点：
The request body can be in multiple formats. These formats are defined by the MIME type of the request. The MIME Type can be set using the Content-Type HTTP header. The most commonly used MIME types are:

```js
multipart/form-data
application/x-www-form-urlencoded
application/json
```

`form-data` 提交数据:
```shell
   ...
  -F age=12 \
  -F 'sex=男'
```

## 其他关于curl的api
- `curl -o test.txt www.baidu.com`  // 保存到test.txt文件中
- `curl -i www.cnblogs.com`  // 显示头信息
- `curl -v www.baidu.com`   // 显示通信过程
- `curl --referer http://www.yourblog.com http://www.example.com`  referer伪造
- `curl --user-agent “[User Agent]" [URL]`  伪造`userAgent`
- ` curl --cookie "name=xxx" www.cnblogs.com` // cookiw
- `curl --user name:password example.com`  // http 认证



# 扩展上面的伪造 `userage`在来几句

1 模拟手机设备

- 1.1 模拟iPhone
```
Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2
```

- 1.2 模拟Android
```
Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255
```
