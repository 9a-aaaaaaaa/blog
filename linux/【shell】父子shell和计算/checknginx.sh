#! /bin/bash

# 检测nginx 是否运行的脚本

# 自己的实现版本
function check_server_running_myself() {
    nginx
    if [ $? != 0 ]; then
        echo "not found nginx"
    else
        echo "nginx service is success running!"
    fi
}

# 老师的实现方式
function check_server_running() {
    # 连接时间
    timeout=5
    # 重连次数
    fails=0
    # 成功的次数
    success=0

    while true 
    do
        # 静默输出到黑洞文件中
        wget --timeout=${timeout} --tries=1 https://www.baidu.com/ -q -O /dev/null
        
        if [ $? -ne 0 ]; then
           let fails=fails+1 #失败次数+1
        else
           let success+=1
        fi    

        # 对于成功大于2次认为是正常
        if [ $success -ge 2 ]; then
            echo "server is success running"    
            exit 0
        fi    

        if [ $fails -ge 3 ]; then
            echo "send me a email not conneceted!"
            exit 2
        fi    
    done
    
}

check_server_running