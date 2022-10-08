#! /bin/bash

# 很简单的方式，也实现了方面compute.sh的计算功能
# 脚本的实现随着能力会提升，没有完美的实现
# echo $(($1$2$3))


# 循环
num=0
while true 
do
    if [ $num -eq 10 ]; 
    then
        exit 0
        break 
    fi
    num=$((num+1))
    echo "ececute loop" $num
done


for VAR in $LIST
do
    echo $VAR
done
