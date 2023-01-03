import nodemailer from "nodemailer";
import ErrorHandler from "./ErrorHandler.mjs";
import CatchAsyncError
 from "../middleware/CatchAsyncError.mjs";
export const send_email=CatchAsyncError(async function(options){
    
    const mail_transpoter=nodemailer.createTransport({
        host:'smtp-gmail.com',
        port:465,
        service:process.env.SMTP_SERVICES,
        auth:{
            user:process.env.SMTP_SENDER,
            pass:process.env.SMTP_PASSWORD
        }
    });

    const mail_options={
        from:process.env.SMTP_SENDER,
        to:options.email,
        
        subject:options.subject,
        text:options.message
    }
     mail_transpoter.sendMail(mail_options,function(err,data){
        if(err)
        {
            console.log(err);
        }
        else
        console.log("message sent succesfully");
    });
});
