#! /bin/bash

name="dudu"

# 等于
if [ "$name" = "dudu" ]; then
    echo "yes!"
else 
    echo "no"
fi        

# 不等于
[ "$name" != "dudu" ] && echo ok || echo no

# 取反
[ ! -f "a.txt" ] && echo "---not exist" || echo "--yes"