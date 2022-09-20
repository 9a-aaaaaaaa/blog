![image.png](1.png)

# pm2 是什么？
`pm2` （process manager）是一个`node` 程序管理器。

可以利用它来简化很多`node`应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。

# pm2 解决了什么问题？

- 可以让 `node` 服务 `crash` 掉之后，自动帮我们重启。
- 可以利用多核 `CPU`，支持集群模式，支持负载均衡，但因采用nodejs的cluster模块实现，仅适用于`nodejs`进程；。
- 可以结合 `ci/cd` 工具，自动部署,也提供了简单的部署方式，可以一次性部署多台`server`。
- 日志管理，两种日志，`pm2`系统日志与管理的进程日志，默认会把进程的控制台输出记录到日志中。
- 监控功能，`pm2 monit`监控`cpu`和`memory`使用情况，`keymetrics`监控更为详细
- 最大内存重启，设置最大内存限制，超过限制自动重启
- 支持`source map`，此项针对`js`, `source map`文件是`js`源文件的信息文件，里面存储着源文件的位置信息。


# 安装
 
```js
  npm install -g pm2
```

# 常用命令

```js
    pm2 start app.js
    
    // 指定app的名称
    pm2 start app.js --name myApp
    
    // 集群模式启动
    // -i 表示 number-instances 实例数量
    // max 表示 PM2将自动检测可用CPU的数量 可以自己指定数量
    pm2 start start.js -i max
    
    // 在文件改变的时候会重新启动程序
    pm2 start app.js --name start --watch
    
    // 重启指定应用，如pm2 restart httpServer；
    pm2 reload|restart <appName> [options]  
    
    // 查看所有的应用
    pm2 list
    
    // 删除指定的应用
    pm2 delete app  // 指定进程名删除
    pm2 delete 0    // 指定进程id删除
    
    // 查看某个应用的具体信息
    pm2 describe app
    
    // 控制台 查看资源的消耗情况 
    pm2 monit
    
    
    pm2 restart app // 重启指定名称的进程
    pm2 restart all // 重启所有进程
    
    pm2 logs app    // 查看该名称进程的日志
    pm2 logs all    // 查看所有进程的日志
    
    // 设置pm2开机自启
    // （可选项：ubuntu, centos, redhat, gentoo, systemd, darwin, amazon）
    // 然后按照提示需要输入的命令进行输入, 最后保存设置
    pm2 startup centos 
    pm2 save
    
    
    // 杀掉pm2管理的所有进程；
    pm2 kill 
```

# 通过pm2配置文件来自动部署项目

`pm2`配置文件方式支持`yml`与`json`格式。


## 1: 在项目根目录下新建一个 `deploy.yaml` 文件

```js
# deploy.yaml
apps:
  - script: ./start.js       # 入口文件
    name: 'app'              # 程序名称
    env:                     # 环境变量
      COMMON_VARIABLE: true
    env_production:
      NODE_ENV: production

deploy:                     # 部署脚本
  production:               # 生产环境
    user: lentoo            # 服务器的用户名
    host: 192.168.2.166     # 服务器的ip地址
    port: 22                # ssh端口
    ref: origin/master      # 要拉取的git分支
    ssh_options: StrictHostKeyChecking=no # SSH 公钥检查
    repo: https://github.com/**.git # 远程仓库地址
    path: /home              # 拉取到服务器某个目录下
    pre-deploy: git fetch --all # 部署前执行
    post-deploy: npm install &&  pm2 reload deploy.yaml --env production # 部署后执行
    env:
      NODE_ENV: production
```
## 2: 配置git的ssh免密认证

- 在服务器中生成`rsa`公钥和私钥，当前是 `centos7` 下进行
- 前提服务器要安装`git`，没有安装的先安装`git`

```js
    yum –y install git
```
- 生成秘钥

```js
    ssh-keygen -t rsa -C "xxx@xxx.com"
```
在`~/.ssh`目录下有 `id_rsa`和 `id_rsa.pub`两个文件，其中`id_rsa.pub`文件里存放的即是公钥`key`。

## 3: 使用pm2部署项目
每次部署前先将本地的代码提交到远程`git`仓库, 首次部署
```js
pm2 deploy deploy.yaml production setup 
```

复制代码部署完成后，既可登陆服务器查看配置的目录下是否从`git`上拉取了项目,再次部署

```js
pm2 deploy deploy.yaml production update
```

## 4；该部署流程同样适用前端项目

如`vue-cli`的项目，自动部署到服务器，自动执行`npm run build` 命令，生成的`dist`目录，指定到`nginx`的静态文件目录下。

## 5： `win` 上最好使用`git bash` 或者其他支持`bash`的`ttl`操作。

ps：这篇文章写的很简练，下面参考官方文档，本地对上面的核心的点做一个一一验证，也算是对理论的补充，毕竟我没有在生产服务器上操作过。

## 6:  使用本地配置启动 pm2

> You can also create a configuration file, called Ecosystem File, to manage multiple applications. To generate an Ecosystem file。

```js
pm2 ecosystem  
```
会自动生成一个`ecosystem.config.js`的配置文件，很多伙伴跟我一样`win`学习的时候如果发现不行的话，可以使用`powershell`来生成。

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
     name: 'worker',
     script: 'worker.js'
  }]
}
```
启动的时候直接使用：

```js
 pm2 start process.yml
```

参数一览表：
- `name`  应用进程名称；
- `script`  启动脚本路径；
- `cwd`  应用启动的路径，关于script与cwd的区别举例说明：在/home/polo/目录下运行`/data/release/node/index.js`，此处`script`为`/data/release/node/index.js`，cwd为`/home/polo/`；
- `args`  传递给脚本的参数；
- `interpreter`  指定的脚本解释器；
- `interpreter_args`  传递给解释器的参数；
- `instances`  应用启动实例个数，仅在cluster模式有效，默认为fork；
- `exec_mode`  应用启动模式，支持fork和cluster模式；
- `watch`  监听重启，启用情况下，文件夹或子文件夹下变化应用自动重启；
- `ignore_watch`  忽略监听的文件夹，支持正则表达式；
- `max_memory_restart`  最大内存限制数，超出自动重启；
- `env`  环境变量，object类型，如 `{"NODE_ENV":"production", "ID": "42"}`；
- `log_date_format`  指定日志日期格式，如 `YYYY-MM-DD HH:mm:ss`；
- `error_file`  记录标准错误流，`$HOME/.pm2/logs/XXXerr.log)`，代码错误可在此文件查找；
- `out_file`  记录标准输出流，`$HOME/.pm2/logs/XXXout.log)`，如应用打印大量的标准输出，会导致pm2日志过大；
- `min_uptime`  应用运行少于时间被认为是异常启动；
- `max_restarts`  最大异常重启次数，即小于`min_uptime`运行时间重启次数；
- `autorestart`  默认为true, 发生异常的情况下自动重启；
- `cron_restart`  crontab时间格式重启应用，目前只支持`cluster`模式；
- `force`  默认false，如果true，可以重复启动一个脚本。`pm2`不建议这么做；
- `restart_delay`  异常重启情况下，延时重启时间；




# 参考

-  https://pm2.keymetrics.io/
-  https://juejin.cn/post/6844903665107468296












