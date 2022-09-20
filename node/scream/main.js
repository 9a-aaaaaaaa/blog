const fs = require('fs');
let x = 0;
const readStream = fs.createReadStream('./sulian.rmvb');

const writeStream = fs.createWriteStream('copy.mp4');

readStream.on('data',(chunk)=>{
     x++;
     writeStream.write(chunk) === false ? readStream.pause() : writeStream.write(chunk);

});

readStream.on('error',(err)=>{
  console.log(err.stack);
});


readStream.on('end',(err)=>{
  if(err) throw new Error(err);
  writeStream.end();
});

writeStream.on('drain',()=>{
   console.log('drain');
   readStream.resume();
});

writeStream.on('finish',function(){
  console.log('结束：'+x)
});



// 7480
// const readStream = fs.createReadStream('./sulian.rmvb');
//
// const writeStream = fs.createWriteStream('copy1.mp4');
// let ct = 0;
//
//
//
// readStream.on('data',function(){
//    ct++
// });
//
// writeStream.on('finish',function(){
//   console.log('结束：'+ct)
// });
//
// readStream.pipe(writeStream);
