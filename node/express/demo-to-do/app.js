var createError = require('http-errors');
var express = require('express');
var indexRouter = require('./routes/index');
var app = express();


// 之前的版本是使用 body-parse,现在的版本不在需要了
// 配置解析表单请求体：application/json
app.use(express.json());
// 配置另外一种：x-www-form-urlencodeed 获取数据的格式
app.use(express.urlencoded({ extended: false }));


app.use('/todos', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("这里能不匹配到", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
