const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const axios = require('axios');

function getIssueList(cb){
    const url = 'https://api.github.com/repos/9a-aaaaaaaa/blog/issues';
    const auth = 'token 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';
    axios.get(url, {
        headers: {
            'Authorization': auth
        }
    })
    .then(function (response) {
       const getIssueList = response.data;
       const getMd = getIssueList.filter(i=>i.state === 'open').map(i=>{
            return {
                file: i.url,
                md: i.title,
                labels: i.labels[0].name
            }
       });
       cb && cb(getMd);
    })
    .catch(function (error) {
        console.log("拉去异常", error);
    })
}


function init(){
    config.dir.forEach(i=>{
        writeFile(path.resolve(__dirname,i),i);
    });
}

// 写最外层的index.md和内部的
function writeFile(tempDir,title,isRoot=false){
    fs.readdir(tempDir,'utf-8',(err,res)=>{
        if(err) throw new Error("err", err);
        const {md,file} = selectMdFile(title,res,isRoot);
        const fils = file.reduce((previous, current) =>  previous + '\n' + current, '');
        generateMenu(path.resolve(tempDir,md), fils,isRoot);
    })
}


function generateMenu(md,fils,isRoot){
    if(isRoot) md = '../blog/README.md';
    if(!isRoot){
        try { fs.rmSync(md) } catch (error) {}
    }
    console.log('111',md,fils);
    fs.appendFileSync(md,fils+"\n",'utf-8');
}


function selectMdFile(title,arr,isRoot) {
    let md = 'README.md';
    let file = [`## ${title} \n`];
    for (let index = 0; index < arr.length; index++) {
        const active = arr[index];
        if(path.extname(active) === '.md') {
            md = active;
            continue;
        }
        const tempDir = path.join(__dirname,title,active);
        const isDir = fs.lstatSync(tempDir).isDirectory();
        if(isDir) {
            const acLi = isRoot ? `./${title}/${encodeURIComponent(active)}` : `./${encodeURIComponent(active)}`;
            const li = `- [${[active]}](${acLi}/index.md)`;
            file.push(li);
        }
    }

    return {
        md,
        file
    }
}


function initMainReadmd(){
    try { fs.rmSync('../blog/README.md') } catch (error) {}
    fs.readdir('../blog',(err,res)=>{
        if(err) throw new Error(err);
        console.log(res);
        res.forEach(i=>{
            if(!(fs.lstatSync(i).isDirectory()) || i.startsWith('.')) return;
            const dir = path.resolve(__dirname,i);
            writeFile(dir,i,true);
        })
    })
}

process.nextTick(()=>{
    init();
});


initMainReadmd();

// getIssueList(function(data){
//     console.log('data', data);
//     // data.forEach(item=>{
//     //     generateMenu(item.md,item.file,true);
//     // })
// });