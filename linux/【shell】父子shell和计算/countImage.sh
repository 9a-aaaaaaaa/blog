#! /bin/bash

# 统计所有的图片个数
ls -lhR | grep '.png' |wc -l


# 判断文件名称是否合法
# 匹配上了返回长度，否则返回0（假）
if expr "$1" ":" ".*\.png" &> /dev/null; then
    echo "[success] this is image file"
else 
    echo "[wrong]"
fi        

