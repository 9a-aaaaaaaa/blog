const fs = require("fs");
const path = require("path");
const { setTimeout } = require("timers/promises");
const config = require("./config.json");


function init(){
    config.dir.forEach(i=>{
        writeFile(path.resolve(__dirname,i),i);
    });
}

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
    console.log(md,fils,isRoot);
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
        res.forEach(i=>{
            if(!(fs.lstatSync(i).isDirectory()) || i.startsWith('.')) return;
            const dir = path.resolve(__dirname,i);
            writeFile(dir,i,true);
        })
    })
}

init();

setTimeout(()=>{
    initMainReadmd();
},2000)