#https

- https协议需要到ca申请证书，一般免费证书很少，需要交费。[阿里云等可以申请免费证书服务]

- http是超文本传输协议，信息是明文传输，https 则是具有安全性的ssl加密传输协议。

- http和https使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。

- http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全。

# 最简单实现

```
//最下面
var https = require('https')
    ,fs = require("fs");

var options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

https.createServer(options, app).listen(3011, function () {
    console.log('Https server listening on port ' + 3011);
});

```

# 实际开发中
> 在实际的开发环境中，`https`一般都是跟`nginx`来结合使用的,一般都是`nginx`转发`http`服务到`https`.具体代码可以到nginx目录下面查看具体配置过程。