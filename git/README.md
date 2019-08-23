## git 相关知识

![分布式代码管理](./0.jpg "分布式代码管理")

### 一. 查看基本配置信息

```
 git config –list  // 要检查已有的配置信息，可以使用
 git config --global user.name "John Doe"  // 也可以具体项目不适用global选项
 git config --global user.email johndoe@example.com

```

### 二. 版本库(repository)初始化
   
   ```shell
     mkdir mytest && cd mytest
     git init
     ls -ah  // 查看隐藏文件

     touch a.txt b.txt c.txt
     git add a.txt
     git add b.txt c.txt
     git commit -m "add 3 files."
   ```
> linux中`>`表示覆盖原文件内容，每次会生成一个新的文件内容（文件的日期也会自动更新），`>>`表示追加内容（会另起一行，文件的日期也会自动更新）。

```
 history > history.log      （history.log 文件 会自动生成）
 cat history.log 


 // curl
 curl http://www.codebelief.com > index.html

// 文件写入
 echo "当前日期是 `date`" >> hosts.log
```

 将history命令执行的结果保存到history.log文件中,我们可以看到我们`shell`界面操作过的所有命令到写入到了`history.log`文件中。


### 三. 查看版本库变动信息 。
```
  echo 'hello world'>>a.txt
  git status
  git diff a.txt  // 或者git diff HEAD 或者直接git diff
```
`git diff`此命令比较的是**工作目录**中当前文件和**暂存区域快照**之间的差异，也就是修改之后还没有暂存起来的变化内容。

`git diff --staged` 是看已经**暂存起来的文件**和**上次提交时的快照**之间的差异。

> 前置知识补充：

工作区修改  add到  -> 暂存区  然后,commit到 ->  版本库

HEAD 当前版本

HEAD^ 上一个版本

HEAD^^ 上上一个版本 。。。


![git工作流程](./2.png "git工作流程")


### 三. 版本回退

  3.1 上面`a.txt` `b.txt`都发生了多次的修改

```
 git reset --hard HEAD^  // 把当前版本回退到上一个版本

 git reflog  // 查看历史提交命令，拿到版本号，方便返回到版本回退之前的版本中。

 git reset --hard 1094a

 git show --stat 查看某提提交的具体信息

```
>3.2 注意三种模式
> 
 (1)： `reset --hard`：重置stage区和工作目录:也就是说暂存区的和工作区的在`commit`以后的内容会全部被清除掉。

 (2):  `soft` – 不会丢弃修改，而是将修改放到暂存区，后续继续修改，或者丢弃暂存区的修改就可以随意了。就仅仅将头指针恢复，已经add的缓存以及工作空间的所有东西都不变。 `git reset --soft HEAD~1` ：将最近一次提交` HEAD~1` 从本地仓库回退到暂存区.本人经过多次测试发现其实使用 commitid比较好。

 (3):`mixed` – 默认选项。缓存区和你指定的提交同步，但工作目录不受影响

3.3 撤销修改强大的`git checkout`

```
git checkout -- readme.txt //把readme.txt文件在工作区的修改全部撤销，就分两种情况，一种是已经提交了，一种是没有。

（1）: 暂存区时，想丢弃修改，分两步，第一步用命令git reset HEAD <file>
（2）：提交到了版本库，git reset --hard HEAD^
```
3.4 删除命令

```
rm hi.txt
git rm hi.txt
git commit -m'删除hi.txt文件'
```



### 三. 远程仓库

本地创建  `git init` 上传到`github` 需要的条件：

1:  git创建仓库的时候只填写name  选择public即可，不要生成不必要的其他的文件.

2: `git remote add origin git@github.com:michaelliao/learngit.git ` 如果有失败 可以 `git remote —h` 查看删除重新绑定一下url

3: 然后  git push -u origin master 由于第一次推送 要加上u


### 四. 分支管理
![分支管理](./3.png "git工作流程")

```
Git鼓励大量使用分支：
查看远程分支：git branch -a
查看分支：git branch
创建分支：git branch <name>
切换分支：git checkout <name>
创建+切换分支：git checkout -b <name>
合并某分支到当前分支：git merge <name>
删除分支：git branch -d <name>
-D 没有合并的分支是删除不掉的 需要强行删除
git log --graph --pretty=oneline --abbrev-commit 查看分支情况
```

4.1 分支管理中`stash`
```
git stash
git stash list
git show stash@{0} # see the last stash
git stash pop      # 从git栈中获取到最近一次stash进去的内容，恢复工作区的内容。。获取之后，会删除栈中对应的stash。由于可能会stash多次，git使用栈管理，我们可以使用git stash list查看所有的stash
===git stash pop@{0} 有误这个句子测试
git stash apply stash@{1}
git stash drop stash@{5}
慎用！！！git stash clear
```

## 其他命令总结
```
git remote -v  // 查看本地添加了哪些远程地址
git remote add origin https://gitee.com/xx/x.git  // 推送到服务器时首先要添加远程地址的
git remote remove origin  // 删除本地指定的远程地址

```

## 常见错误
1:! [rejected] master -> master (non-fast-forward)  git push -f


2: 美化输出`git lg`：`git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --"`

3: `git checkout -b dev origin/dev`  检出远程分支映射到本地分支同名

注意：如果`git pull`提示`no tracking information`，则说明本地分支和远程分支的链接关系没有创建，用命令`git branch --set-upstream-to <branch-name> origin/<branch-name>`。

eg:  pull 会失败 是因为没有指定本地分支与远程分支的关联：
      `git branch --set-upstream-to=origin/dev dev `

4: 简写
```
git config --global alias.co checkout    // git co
git config --global alias.ci commit        // git ci
git config --global alias.br branch       // git br
```
5: `git commit --amend -C HEAD ` 覆盖之前的提交代码。   