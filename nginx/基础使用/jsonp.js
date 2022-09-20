var http = require('http');
var url = require('url');

var port = 3006;
var data = {'name': 'qiuyanlong'};


http.createServer(function(req, res){

  var params = url.parse(req.url, true);

  if (params.query && params.query.callback) {

    var str =  params.query.callback + '(' + JSON.stringify(data) + ')';

    res.setHeader('Content-Type','text/html');
    res.stateCode = 200;
    res.end(str);

  } else {

    res.end(JSON.stringify(data));//普通的json

  }
}).listen(port, function(){
  console.log('server is listening on port ' + port);
});
