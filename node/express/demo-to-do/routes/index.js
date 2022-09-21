var express = require('express');
var { getList,getById,saveTodos }  = require("./../middle/dataAction");
var router = express.Router();

/* GET home page. */
router.get('/', getList, function(data,req, res, next) {
    res.status(200).json({ title: data});
});


router.get('/:id',getById, function(data,req, res, next) {
   res.json({ data });
});

router.post('/', saveTodos, function(data,req, res, next) {
  res.json({ status: "success",data});
});


// 下面三个： 实现比较简单，参考上面实现具体得业务

router.patch('/:id', function(req, res, next) {
  res.json({ title: 'patch id' });
});


router.delete('/:id', function(req, res, next) {
  res.json({ title: 'delete id' });
});

module.exports = router;
