# 列举常见的docker使用


### redis

```shell
docker search  redis
docker pull redis:latest

# -p 6379:6379：映射容器服务的 6379 端口到宿主机的 6379 端口。外部可以直接通过宿主机ip:6379 访问到 Redis 的服务。
docker run -itd --name redis-test -p 6379:6379 redis

docker ps 

# 进入docker
docker exec -it redis-test /bin/bash
redis-cli
set name 1
get name
keys * 
exit

# 使用本地的客户端连接 也可以连接到这个redis
# 如果docker里面的数据被关闭了，外面也是无法进行访问的
redis-cli
get name 

docker run -d -p 6379:6379 -v v_node_data:/data --name redis3 redis redis-server /etc/redis/redis.conf --requirepass 12345678



# 创建本地volume
docker volume create --name v_redis_data
# 挂载到本地
docker run -d -p 6379:6379 -v v_node_data:/data --name redis4 redis
# 查看 
docker volume inspect v_node_data
```


### 部署nginx

![image.png](11.png)

上图模拟了端口暴露的的原理。

```shell
# 搜索
docker search nginx

# 拉取镜像
docker pull nginx

# 将nginx 默认80指向外网3344 单独命名nginx_01
docker run -d nginx --name nginx_01 -p 3344:80 nginx 

# 验证是否可以访问
curl 192.168.0.1:4433 

# 进入nginx 容器
docker exec -it /bin/bash 

# whereis nginx
nginx: /usr/sbin/nginx /usr/lib/nginx /etc/nginx /usr/share/nginx

```
通过上面发现，每次修改`nginx`的每次修改配置都需要在内部修改，后面使用容器卷方式来挂在的话，就不需要在单独进入来处理。

### 部署tomcat应用

```shell
# 搜索镜像
docker search tomcat 

docker pull tomcat 

docker images

# 端口指定和名称指定
docker run -d -p 8000:8080 --name tomcat_01 tomcat 

# 进入
docker exec -it c4b104964c2b /bin/bash 

whereis tomcat 

# 拷贝文件到webapps，默认这个文件为空
cp -r webapps.dist/* webapps

# 直接可以在外网ip:8000访问这个服务了
```