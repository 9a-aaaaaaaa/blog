## HTTPAuth: Node.js  HTTP BasicAuth 基本认证
> Basic认证是客户端与服务器进行请求时，允许通过用户名和密码实现的一种身份认证方式


如果一个页面需要`Basic`认证，它会检查请求报文头中的`Authorization`字段的内容，该字段的值由认证方式和加密值构成，如下所示:

```
>GET/HTTP/1.1
>Authorization: Basic dXNlcjpwYXNz
>User-Agent:curl/7.24.0 (x86_ 64-apple一darwin12.0) libcurl/7.24.0 OpenSSL/0.g.8r zlib/1.2.5
>Host:www.baidu.com
>Accept:*/*
```

在Basic认证中，它会将用户和密码部分组合:"username"+":"+"password"。然后进行Base64编码，如下所示：

- 不要通过 `form` 提交表单的默认方式发送请求，转而使用 `fetch `或 `ajax`
- 客户端注意设置 `Authorization` 字段的值为 `'Basic xxx'`，通过该 `Http `字段传递用户名密码
- base64 的方法在客户端要注意兼容性 `btoa `，(注意btoa这货不兼容中文)建议使用现成的库如 `'js-base64'` 等，NodeJS 方面使用全局的 Buffer
- 服务端验证失败后，注意返回 `401`，但不用返回 `'WWW-Authenticate: Basic realm="..."'` 避免浏览器出现弹窗


## 总结
> 虽然经过`Base64`加密后在网络中传送，但是这几乎是明文，十分危险，一般只有在HTTPS情况下使用。也可加入服务器端随机数来保护认证过程

