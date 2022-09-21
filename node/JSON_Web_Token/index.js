var jwt = require('jsonwebtoken');


// 同步生成jwt  签名： shhhhh key 一般使用md5生成的唯一值在配置文件中
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
console.log(token);




// var privateKey = ".nameaaaa";//fs.readFileSync('private.key');
// jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
//    console.log(err,token);
// });

// 验证jwt

const getData = jwt.verify(token,'shhhhh');
console.log(getData);