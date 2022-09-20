# pm2
> pm2 是一个带有负载均衡功能的Node应用的进程管理器。可以把你的独立代码利用全部的服务器上的所有CPU，并保证进程永远都活着，0秒的重载。


# pm2的主要特性
 1、内建负载均衡（使用Node cluster 集群模块）

2、后台运行

3、0秒停机重载

4、具有Ubuntu和CentOS 的启动脚本

5、停止不稳定的进程（避免无限循环）

6、控制台检测

7、提供 HTTP API

8、远程控制和实时的接口API ( Nodejs 模块,允许和PM2进程管理器交互 )

# pm2的安装

`npm install -g pm2`

# pm2的用法

```
    pm2 start app.js -i 4   // 后台运行pm2，启动4个app.js 
                            // 也可以把'max' 参数传递给 start
                            // 正确的进程数目依赖于Cpu的核心数目
    pm2 start app.js --name my-api // 命名进程
    pm2 list               // 显示所有进程状态
    pm2 monit              // 监视所有进程
    pm2 logs               //  显示所有进程日志
    pm2 stop all           // 停止所有进程
    pm2 restart all        // 重启所有进程
    pm2 reload all         // 0秒停机重载进程 (用于 NETWORKED 进程)
    pm2 stop 0             // 停止指定的进程
    pm2 restart 0          // 重启指定的进程
    pm2 startup            // 产生 init 脚本 保持进程活着
    pm2 web                // 运行健壮的 computer API endpoint 
    pm2 delete 0           // 杀死指定的进程
    pm2 delete all         // 杀死全部进程12345678910111213141516
```


# pm2运行进程的不同方式

```
    pm2 start app.js -i max  // 根据有效CPU数目启动最大进程数目
    pm2 start app.js -i 3      // 启动3个进程
    pm2 start app.js -x        //用fork模式启动 app.js 而不是使用 cluster
    pm2 start app.js -x -- -a 23   // 用fork模式启动 app.js 并且传递参数 (-a 23)
    pm2 start app.js --name serverone  // 启动一个进程并把它命名为 serverone
    pm2 stop serverone       // 停止 serverone 进程
    pm2 start app.json        // 启动进程, 在 app.json里设置选项
    pm2 start app.js -i max -- -a 23                   //在--之后给 app.js 传递参数
    pm2 start app.js -i max -e err.log -o out.log  // 启动并生成一个配置文件

    // 也可以执行用其他语言编写的app  ( fork 模式):
    pm2 start my-bash-script.sh    -x --interpreter bash
    pm2 start my-python-script.py -x --interpreter python12345678910111213

    pm2 list
    列出由pm2管理的所有进程信息，还会显示一个进程会被启动多少次，因为没处理的异常。
    pm2 monit
    监视每个node进程的CPU和内存的使用情况。
    pm2 logs
    实时集中log处理。
    快速恢复
    现在事情一切顺利,你的进程嗡嗡的运行着,你需要做一次硬重启(hard restart).现在吗?是的,首先,dump掉:
    $ pm2 dump

    然后,你可以从文件中恢复它:
    $ pm2 kill // 让我们假设一个PM2停掉了 
    $ pm2 resurect // 我所有的进程又满血满状态复活了 
```

# 常用命令总结

```
pm2 logs  显示所有进程日志
pm2 stop all 停止所有进程
pm2 restart all 重启所有进程
pm2 reload all 0秒停机重载进程 (用于 NETWORKED 进程)
pm2 stop 0 停止指定的进程
pm2 restart 0 重启指定的进程
pm2 startup 产生 init 脚本 保持进程活着
pm2 web 运行健壮的 computer API endpoint (http://localhost:9615)
pm2 delete 0 杀死指定的进程
pm2 delete all 杀死全部进程
```

# 运行进程的不同方式

```
pm2 start app.js -i max 根据有效CPU数目启动最大进程数目
pm2 start app.js -i 3 启动3个进程
pm2 start app.js -x 用fork模式启动 app.js 而不是使用 cluster
pm2 start app.js -x -- -a 23 用fork模式启动 app.js 并且传递参数 (-a 23)
pm2 start app.js --name serverone 启动一个进程并把它命名为 serverone
pm2 stop serverone 停止 serverone 进程
pm2 start app.json 启动进程, 在 app.json里设置选项
pm2 start app.js -i max -- -a 23 在--之后给 app.js 传递参数
pm2 start app.js -i max -e err.log -o out.log 启动 并 生成一个配置文件
```

# 配置pm2启动文件

在项目根目录添加一个processes.json：
```
{
  "apps": [
    {
      "name": "mywork",
      "cwd": "/srv/node-app/current",
      "script": "bin/www",
      "log_date_format": "YYYY-MM-DD HH:mm Z",
      "error_file": "/var/log/node-app/node-app.stderr.log",
      "out_file": "log/node-app.stdout.log",
      "pid_file": "pids/node-geo-api.pid",
      "instances": 6,
      "min_uptime": "200s",
      "max_restarts": 10,
      "max_memory_restart": "1M",
      "cron_restart": "1 0 * * *",
      "watch": false,
      "merge_logs": true,
      "exec_interpreter": "node",
      "exec_mode": "fork",
      "autorestart": false,
      "vizion": false
    }
  ]
}
```
说明:
```
apps:json结构，apps是一个数组，每一个数组成员就是对应一个pm2中运行的应用
name:应用程序名称
cwd:应用程序所在的目录
script:应用程序的脚本路径
log_date_format:
error_file:自定义应用程序的错误日志文件
out_file:自定义应用程序日志文件
pid_file:自定义应用程序的pid文件
instances:
min_uptime:最小运行时间，这里设置的是60s即如果应用程序在60s内退出，pm2会认为程序异常退出，此时触发重启max_restarts设置数量
max_restarts:设置应用程序异常退出重启的次数，默认15次（从0开始计数）
cron_restart:定时启动，解决重启能解决的问题
watch:是否启用监控模式，默认是false。如果设置成true，当应用程序变动时，pm2会自动重载。这里也可以设置你要监控的文件。
merge_logs:
exec_interpreter:应用程序的脚本类型，这里使用的shell，默认是nodejs
exec_mode:应用程序启动模式，这里设置的是cluster_mode（集群），默认是fork
autorestart:启用/禁用应用程序崩溃或退出时自动重启
vizion:启用/禁用vizion特性(版本控制)
```

可以通过`pm2 start processes.json`来启动。也可以把命令写在package.json里，如下:
```
 "scripts": {
    "dev": "NODE_ENV=development nodemon src/server.js & NODE_ENV=development nodemon src/server/action-server.js & tools/redis/socket.js",
    "dev_read_redis": "NODE_ENV=development nodemon src/app.js",
    "start": "NODE_ENV=production nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
启动 `npm run start`


# 或者使用配置文件启动
```
// 名称任意，按照个人习惯来
module.exports = {
  apps: [
    {
      name: 'https-app', // 应用名称
      script: './server.js', // 启动文件地址
      cwd: './', // 当前工作路径
      watch: [
        // 监控变化的目录，一旦变化，自动重启
        "./"
      ],
      ignore_watch: [
        // 忽视这些目录的变化
        'node_modules',
        'logs',
        'public',
      ],
      node_args: '--harmony', // node的启动模式
      env: {
        NODE_ENV: 'development', // 设置运行环境，此时process.env.NODE_ENV的值就是development
        ORIGIN_ADDR: 'http://facebeet.com'
      },
      env_production: {
        NODE_ENV: 'production',
      },
      out_file: './logs/out.log', // 普通日志路径
      error_file: './logs/err.log', // 错误日志路径
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};

```