# docker compose

`Docker Compose` 是 `Docker` 官方编排（Orchestration）项目之一，负责快速的部署分布式应用。桌面版本docker自带这个功能。

eg: 我们一般遵循数据和应用分离的原则，因此如下图，`finance-web-app` 宕机以后，不会影响`mysql`。

![](2022-09-23-16-13-53.png)


`Compose` 恰好满足了这样的需求。它允许用户通过一个单独的 `docker-compose.yml` 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。

Compose 中有两个重要的概念：

- 服务 (`service`)：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。
- 项目 (`project`)：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义。

可见，一个项目可以由多个服务（容器）关联而成，Compose 面向项目进行管理。

核心： **配置文件中定义一个项目存在哪些服务s**。编排的前提是必须有镜像

# 场景

最常见的项目是 web 网站，该项目应该包含 web 应用和缓存。

# 常见命令


[核心模板命令](https://yeasy.gitbook.io/docker_practice/compose/compose_file#build)
[重点参考注释](./web_im/docker-compose.yml)

![](2022-09-23-22-28-59.png)
```yml
# 启动项目的所有服务，必须保证运行命令的目录存在docke-compose.yml文件
docker compose up 


# 启动的时候先打包
docker compose up --build -d

# docker compose 自己去根据Dockfile去构建镜像，然后再根据构建的镜像启动容器
# 而不是我们先手动写Dockfile文件然后build。
# build 和 image不能同时存在，会造成docker-compose 无法识别到底是应该使用个镜像


# 后台启动 yaml 定义的所有容器
docker-compose up -d
# 仅启动 mysql 这个service，会启动其依赖的 service
docker-compose up mysql 指定启动的server名称，
# 停止容器并移除自动创建的网桥
docker-compose down 
# 重启所有 service 后面可以指定上某个具体的 service
docker-compose restart

# 暂停 和 恢复
docker-compose pause
docker-compose unpause

# 进入 redis 这个 service 使用 exit 退出
docker-compose exec redis bash

# 列出当前 yaml 中定义的容器的信息
docker-compose ps

# 删除当前 yaml 中定义的容器，需要先 stop，后面可以指定上某个具体的 service
docker-compose rm

# 查看各个 service 容器内运行的进程情况
docker-compose top

# 查看日志默认查看 yaml 所有的，可以跟上具体 service
# -f 可以保持跟踪，新的日志会马上显示在屏幕上
docker-compose logs


```


# 案例

[mysql 连接的案例](https://citizix.com/how-to-run-mysql-8-with-docker-and-docker-compose/#:~:text=Using%20the%20docker%2Dcompose%20tool,-We%20can%20achieve&text=With%20Compose%2C%20you%20use%20a,to%20mount%20and%20environment%20variables.&text=The%20commands%3A,up%20brings%20up%20the%20container)
