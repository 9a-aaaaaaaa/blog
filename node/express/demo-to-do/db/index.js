const fs = require("fs");
const util = require("util");
const path = require("path");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const url = path.join(__dirname, "./db.json");

// 注意这里错误处理：将错误前置，这里不处理错误，方便业务定制和排查
async function getDb(){
    const res = await readFile(url);
    return JSON.parse(res.toString());
};

module.exports.save = async function(data){
    const res = await getDb();
    const lastIndex = res.list.length;
    res.list.push({
        id: lastIndex,
        ...data
    });

    // 保证写完的json文件也是有格式的，方便阅读
    await writeFile(url, JSON.stringify(res, null, '  '));
};


module.exports.getDb = getDb;
