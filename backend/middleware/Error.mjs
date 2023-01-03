import ErrorHandler from '../utils/ErrorHandler.mjs'

 const error =(err,req,res,next)=>
{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"internal server message";

    //mongodb error handling
    if(err.name=='CastError')
    {
        const message=`resource not found,invalid path ${err.path}`;
        err= new ErrorHandler(message,400);
    }
    //jsonWebToken Error
    if(err.name=='jsonWebTokenError')
    {
        err=new ErrorHandler('this is jsonWebToken Error',400);
    }


    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        //  error:err.stack,

    })
}

export default error;