#! /bin/bash

# 创建文件之前都需要判断
echo "console.log(1);" >> note.txt 
test -e note.txt && echo "file exist" || touch note.txt

# 换一种写法 -a 并且
test -e note.txt -a -x note.txt && cat note.txt


# 使用[]实现一次
[ -e note.txt ] && echo "file exist" || touch note.txt


# 查看文件之前判断是否有权限
[ -x note.txt ] && cat note.txt || chmod +x note.txt

# 查看写入权限 开启一个子shell
[ -w "readme.md" ] && (echo 100 >> readme.md) || echo "no permission"


# linux 系统的一段脚本
SYSTEM_SKIP_CONST=""
# PPID 进程id
# PPID 不为空
if [ $PPID -ne 1 -a -z "$SYSTEM_SKIP_CONST" ] && [ -d /run/system ];then
    echo "$0"
fi
