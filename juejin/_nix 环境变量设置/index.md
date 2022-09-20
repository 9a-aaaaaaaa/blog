
![src=http___www.idctx.cn_d_file_p_2018-11-20_b5c2eb93e03cd594e9cda6e056ddcd06.jpg&refer=http___www.idctx.jpeg](1.jpg)

> 每次换新电脑或者安装新的软件的时候，都会设置这几个文件，但是你有没有仔细想过，这几个文件有什么区别吗？

## 1：profile

`profile（/etc/profile`），用于设置系统级的环境变量和启动程序，在这个文件下配置会对所有用户生效。当用户登录`（login）`时，文件会被执行，并从`/etc/profile.d`目录的配置文件中查找`shell`设置。


一般不建议在`/etc/profile`文件中添加环境变量，因为在这个文件中添加的设置会对所有用户起作用。当需要添加时，我们可以按以方式添加：


```js
export TEST=www.baidu.com
```

如，添加一个HOST值为itbilu.com的环境变量：添加时，可以在行尾使用;号，也可以不使用。一个变量名可以对应多个变量值，多个变量值使用:分隔。

添加环境变量后，需要重新登录才能生效，也可以使用source命令强制立即生效：

```js
source /etc/profile 
echo $TEST # www.baidu.com
```

## 2: bashrc文件

这个文件用于配置函数或别名。`bashrc`文件有两种级别：系统级的位于`/etc/bashrc`、用户级的`~/.bashrc`，两者分别会对所有用户和当前用户生效。

`bashrc`文件只会对指定的`shell`类型起作用，`bashrc`只会被`bash shell`调用。

## 3: bash_profile文件

`bash_profile`只有单一用户有效，文件存储位于`~/.bash_profile`，该文件是一个用户级的设置，可以理解为某一个用户的`profile`目录下。这个文件同样也可以用于配置环境变量和启动程序，但只针对单个用户有效。

和`profile`文件类似，`bash_profile`也会在用户登录（`login`）时生效，也可以用于设置环境变理。但与`profile`不同，`bash_profile`只会对当前用户生效。


## 4: 配置文件的读取顺序

当登入系统时候获得一个`shell`进程时，其读取环境设定档有三步 :

1. 首先读入的是全局环境变量设定档`/etc/profile`，然后根据其内容读取额外的设定的文档，如 `/etc/profile.d`和`/etc/inputrc`。

2. 然后根据不同使用者帐号，去其家目录读取`~/.bash_profile`，如果这读取不了就读取`~/.bash_login`，这个也读取不了才会读取`~/.profile`，这三个文档设定基本上是一样的，读取有优先关系

3. 然后在根据用户帐号读取`~/.bashrc`。

因此顺序可以总结为如下：

```bash
/etc/profile
/etc/bashrc
~/.bash_profile
~/.bash_login
~/.profile
~/.bashrc
```


## 5: /etc/*和~/.*区别：

- `/etc/profile`,`/etc/bashrc`: 是系统全局环境变量设定

- `~/.profile`，`~/.bashrc`是用户家目录下的私有环境变量设定

## 6: \~/.profile与~/.bashrc的区别:

都具有个性化定制功能:

- `~/.profile`可以设定本用户专有的路径，环境变量等，它只在登入的时候执行一次。
- `~/.bashrc`也是某用户专有设定文档，可以设定路径，命令别名，每次`shell script`的执行都会使用它一次。



