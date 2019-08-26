#  chmod 755 hello.sh
# 变量
starIno='send post requesyt start'
echo ${starIno}
# curl -d 'qiuyanlong' http://127.0.0.1:8081
# curl -d 'zhansan' http://127.0.0.1:8081
# curl -d 'lilei' http://127.0.0.1:8081
for var in qiuyanlong zhangsan list jack rose jj blue
do
    curl -d $var http://127.0.0.1:8081
done
echo 'post done'
curl -i http://127.0.0.1:8081
# 安全的推出
sleep 3s
echo 'start delete';
read -p "input you want to delet item id>" ids
echo "your input is $ids"

if (($ids>0)) && (($ids<4));then
    curl -i -X DELETE http://127.0.0.1:8081/${ids}
    if [ $? -ne 0 ]; then
        echo '------500,server has some wrong-------'
    else 
        echo "delete ietm id success $ids"
    fi    
else 
    echo "opps, a error has occured $ids"
fi

curl -i http://127.0.0.1:8081

echo "test http method put"
read -p "input you want to put sources>" pid
read -p "what is name is you wang?" putname
curl -v -X PUT -d $putname http://127.0.0.1:8081/${pid}
curl -i http://127.0.0.1:8081
echo "over~success"
exit 0



