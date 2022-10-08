#! /bin/bash
# mac 上有些指令有问题，在linux上执行

# 使用tr 进行替换生成计算式
echo {0..1000} | tr " " "+"| bc


# seq 在mac上parse 有问题
seq -s "\+" 100 | bc


echo $((`seq -s "+" 10`)) 


# linux 下接受前面的传递的参数 xargs:是linux下构造参数得命令
seq -s " + " 100 | xargs expr

#AWK 支持小数计算
echo "1.2 2.1" | awk '{print $1+$2}'
echo "1.2 2.1" | awk '{print $1+$2*4}' # 9.6