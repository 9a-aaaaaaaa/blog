#! /bin/bash
# 判断用户的输入，只能是1或者2

read  -t 5 -p "Please enter your number: " enter_number

# {} 是一个执行区块
[ "$enter_number" = "1" ] && {
    echo "here is :" $enter_number
    exit 0
}

if test "$enter_number" -eq "2"; then
    echo "you enter is:" $enter_number
fi


[[ "$enter_number" = "3" ]] && {
    echo "haha here :" $enter_number
    exit 0
}

[ "$enter_number" != "1" -a "$enter_number" != "2" -a "$enter_number" != "3" ] && {
    echo '[opps], error we need 1 || 2 || 3'
    exit 1
}