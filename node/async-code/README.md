## 异步回调函数在node中的前世今生

> deom 实现读取本地一个文件中的数据，将其添加到模板里面进行输出。


基于回调的执行方式
```js
const server = http.createServer((req,res)=>{
  if(req.url !== '/favicon.ico'){
    fs.readFile('./arcticle.json',(err,jsonDate)=>{
        if(err) errFn(err,res);
        let jsons = JSON.parse(jsonDate);
        fs.readFile('./template.html',(errTem,data)=>{
            if(err) errFn(errTem,res);
            let myShtml = data.toString()
                .replace("{{title}}",jsons.title)
                .replace('{{list.class}}',jsons.list[0]);
              res.writeHead(200,{'Content-Type':'text/html'});
              res.end(myShtml);
        })
    })
  }
});
```

async-await代码的写法

```js
const readAsync = util.promisify(fs.readFile);
async function init () {
  let jsons = await readAsync('./arcticle.json');
  let myShtml = await readAsync('./template.html');
      jsonData = JSON.parse(jsons);
  let myShtmlContent = myShtml.toString()
      .replace("{{title}}",jsonData.title)
      .replace('{{list.class}}',jsonData.list[0]);
  return myShtmlContent;
};
```