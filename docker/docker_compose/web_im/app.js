const express = require("express");
const app = express();
const port = process.env.port || 8001;

// 会捕获到dockerfile 中传递的环境变量进来
console.log(process.env);

app.get("/",(err,res)=>{
    res.json({
        status:"success",
        code: 0
    })
})


app.listen(port,()=>{
    console.log("server is runnering!");
})


