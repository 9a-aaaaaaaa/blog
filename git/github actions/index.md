<!-- vscode-markdown-toc -->
* 1. [主要作用](#主要作用)
* 2. [基本概念](#基本概念)
* 3. [workflow 文件](#workflow-文件)
* 4. [ 密码秘钥的添加：](#-密码秘钥的添加：)
* 5. [案例：](#案例：)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc --># github actions 全方位解读



`action` 就是一个独立脚本，因此可以做成代码仓库，使用userName/repoName的语法引用 action。比如，actions/setup-node就表示github.com/actions/setup-node这个仓库，它代表一个 action，作用是安装 
Node.js。事实上，GitHub 官方的 actions 都放在 `github.com/actions` 里面。


##  1. <a name='主要作用'></a>主要作用
特定的时期下，做特定的任务

##  2. <a name='基本概念'></a>基本概念

GitHub Actions 有一些自己的术语。

（1）`workflow` （工作流程）：持续集成一次运行的过程，就是一个 `workflow`。

（2）`job` （任务）：一个 `workflow` 由一个或多个 `jobs` 构成，含义是一次持续集成的运行，可以完成多个任务。

（3）`step`（步骤）：每个 `job `由多个 step 构成，一步步完成。

（4）`action` （动作）：每个 step 可以依次执行一个或多个命令（action）。


##  3. <a name='workflow-文件'></a>workflow 文件
GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库的.github/workflows目录。
workflow 文件采用 YAML 格式，文件名可以任意取，但是后缀名统一为.yml，比如foo.yml。一个库可以有多个 workflow 文件。GitHub 只要发现.github/workflows目录里面有.yml文件，就会自动运行该文件。

workflow 文件的配置字段非常多，详见[官方文档](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)。下面是一些基本字段。

位置：.github/workflows/

```yml
name： ci 名称
on:  触发的时机 
  - [push]其他的 pull request
  - 或者这么写 
  brancees:
    - master 在这个分支执行
    paths:  也可以指定src下文件发生改变才会出发
    - src/*

    
    schedule: 和上面的二选一，适用于定时出发的任务
    
jobs: 具体触发的任务
    buld/或者自定义job1:
      runs-on: 表示在什么系统下运行，默认了几种

      container: 运行在这容器中，没有需要的话直接在乌班图中运行
        image: node 8 在乌班图中运行这个容器

      services:
        nginx....



      steps: 步骤：
       - uses: git clone    第一步是下载代码，由于这个部分很通用，github已经做了封装了。actions/checkout@v1  // actions 官方仓库，checkout是官方的ci流程名字
       - run: echo hello;// 执行一个shell指令
         
       - users: actions/java	
       	 width: java-version: 16 # width 主要是传递参数用的，配置users使用
       - run: |  有这个|可以写多行 
           node -v
           cargo -v
```

`uses`: 的工作原理 指定的`ubuntu-latest` 中安装了各种语言的各种版本,在use中运行docker可以理解为安装一个新的，但不是当前这个环境



##  4. <a name='-密码秘钥的添加：'></a> 密码秘钥的添加：
在 setting - secrets 添加 在yml 中 eg： echo ${{secrets.设置的变量名}}

##  5. <a name='案例：'></a>案例：
下面是一个实例，通过 GitHub Actions 构建一个 React 项目，并发布到 GitHub Pages。

[生成github 秘钥](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) 设置为ACCESS_TOKEN

```js
$ npx create-react-app github-actions-demo
$ cd github-actions-demo

// 修改package.json username: 用户名
"homepage": "https://[username].github.io/github-actions-demo",
```

main.yml
```yml
name: GitHub Actions Build and Deploy Demo
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: Build and Deploy
      uses: JamesIves/github-pages-deploy-action@master
      env:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        BRANCH: gh-pages
        FOLDER: build
        BUILD_SCRIPT: npm install && npm run build
```
日志默认保存30天。
