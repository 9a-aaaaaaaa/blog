const fs = require("fs");
const path = require("path");
const config = require("./config.json");


config.dir.forEach(i=>{
    const tempDir = path.resolve(__dirname,i);
    fs.readdir(tempDir,'utf-8',(err,res)=>{
        if(err) console.log("err", err);
        const {md,file} = selectMdFile(i,res);
        generateMenu(path.resolve(tempDir,md), file);

    })
});


function generateMenu(md,file){
    // JSON.stringify(file, null, 1)
    file.forEach((i)=> fs.appendFileSync(md,i+"\n",'utf-8'));
}


function selectMdFile(title,arr) {
    let md;
    let file = [
        `## title \n`,
    ];
    for (let index = 0; index < arr.length; index++) {
        const active = arr[index];
        if(path.extname(active) === '.md') {
            md = active;
            continue;
        }
        const li = `- [${[active]}](./${active})`;
        file.push(li);
    }

    return {
        md,
        file
    }
}