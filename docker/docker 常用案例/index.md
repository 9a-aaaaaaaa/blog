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