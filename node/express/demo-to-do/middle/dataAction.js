var { getDb, save } = require("./../db");
module.exports.getList = async function(req,res,next){
    try {
        // req.todolist 本来打算在这里传递这个参数得
        // 但是经过测试发现，next也是可以传递参数得
        next(await getDb())
    } catch (error) {
        next(error);
    }
}

module.exports.getById = async function(req,res,next){
    try {
        const data = await getDb().a;
        const ids = req.params.id;
        const findList = data.list.filter(i=>i.id == ids);
        console.log(ids, findList);
        next(findList);
    } catch (error) {
        console.log('aaaa',error);
        next('router',error);
        // res.status(500).json({
        //   error: error
        // })
    }
}


module.exports.saveTodos = async function(req,res,next){
    try {
        const body = req.body;
        await save(body);
        next(body);
    } catch (error) {
        console.log(error);
        res.status(500).json({
          error: error
        })
    } 
}
