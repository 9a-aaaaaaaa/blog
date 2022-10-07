#! /bin/bash
# 实现一个计算加减法的脚本

# 日志函数
function log_msg {
  echo "[`date '+ %F %T'` ]: $@"
}

# 提示函数
function print_useage(){
    echo ""
    log_msg "This is sample log message"
    printf "Please enter an integer!!!"
    exit 1
}

# 接受用户输出的参数，校验是不是数字
function arg_input(){
    # read -p 用户输入的内容赋值给这个变量
    if read -t 3 -p "enter number": number; then echo;
    else
        print_useage
    fi    

    # [] 前后必须有一个空格
    # 限制输入纯数字
    # -n 对字符串判断，如果字符串为空，条件就不成立，如果字符串不为空，条件成立
    # sed 字符串中 qw123 所有的数字替换为空,那么就剩下来非数字的
    if [ -n "`echo $number | sed 's/[0-9]//g'`" ]; then
        print_useage
    fi

    return $number
}


# 获取操作符号
# 这个变量发现是全局变量，函数外部都是可以进行访问的
function get_opartor(){
    read -p "enter operator": operator
    # 限制在+-*/
    if [ "${operator}" != "+" ] && [ "${operator}" != "-" ];then
        echo "只允许+-"
        exit 2
    fi  
}


#1: 参数
arg_input
first_number=$?


# 2: 运算符输入
get_opartor  

# 3: 参数
arg_input
second_number=$?

echo "$first_number $operator $second_number 结果是" $(($first_number $operator $second_number))