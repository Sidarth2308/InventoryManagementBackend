const nodemailer = require("nodemailer");

async function forgotPasswordEmail(name,email,token,userId) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILID,
            pass: process.env.PASS,
        }
    });
    var link = `http://localhost:3000/login/updatePassword?user=${userId}&token=${token}`
    // send mail with defined transport object
    var mailOptions = {

        from: process.env.EMAILID,
        to: email,
        subject: 'Reset Password Link',
        html: `
        <div>
        <h3 style="font-weight: 500">
          Dear ${name},<br />
          <br />
          A request for password reset has been received. If it is not by you, Ignore this message.
          If the request is by you, please click the link below :
          <a href="${link}">link</a>

          Alternatively, you can paste this link in your web browser :
          <a href="${link}">${link}</a>
        </h3>
      </div>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        return new Promise((resolve,reject)=>{
            if(error){
                reject(error);
            }else{
                resolve("Email Sent")
            }
        })
    });
  }
  module.exports = forgotPasswordEmail;