//ASYNCRONUS WRAP FUNCTION - USED TO REDUCE THE REWRITING OF TRY,CATCH BLOCKS
function asyncWrap(fun) {
    return function (req, res, next) {
        fun(req, res, next).catch(err => {
            next(err);
        })
    }
}
module.exports=asyncWrap;