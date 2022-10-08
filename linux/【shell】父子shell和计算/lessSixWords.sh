#! /bin/bash

# 找出长度不大于4的单词 利用for循环
for i in I am jack smarter to teacher
do
  if [ ${#i} -le 4 ]; then
    echo $i
  fi  
done



