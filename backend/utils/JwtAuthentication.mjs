//creating token and saving cookie

export const jwt_login=async (user,statuscode,res)=>
{
    const token = await user.getJWTToken();

    //options for cookie
    const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000
        ),
        httpOnly:true
    }

    res.status(statuscode).cookie('token',token,options).json({
        success:true,
        token,
        user
    })
}