# 常见命令


## xargs
`xargs` 又称管道命令，构造参数等。简单的说 就是把 其他命令的给它的数据 传递给它后面的命令作为参数

- -d 为输入指定一个定制的分割符
- -i 用 {} 代替 传递的数据
- -I string 用string来代替传递的数据-n[数字] 设置每次传递几行数据

```bash
ls |grep .php |xargs -i mv {} {}.bak     #将当前目录下php文件,改名字
ls |grep .php |xargs -I {} mv {} {}.bak   #与上例相同
find ./ -name "*.tmp" | xargs -i rm -rf {}  #删除当前文件夹下的，tmp文件
```

## mv

将源文件重命名为目标文件，或将源文件移动至指定目录。
```bash
mv abc abc.php  #将abc重命名为abc.php
mv -t -i ./database 1.sql    #将1.sql移动到database目录下 并且询问是否覆盖
```
