const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail");
const baseservice = require("./baseservice");

function mailservice (){
    this.serviceName = "mailservice";
    baseservice.call(this);
}

mailservice.prototype.sendOTP = function(email , OTP){

    let transporter = nodemailer.createTransport(mailConfig);

    return new Promise((res, rej) => {

        transporter.sendMail({
            from : "sender@example.com",
            to : "reciever@example.com",
            subject : "Dashboard Login OTP",
            text : `Greetings , your OTP for email - ${email} is ${OTP}`,
            html : `<html>
            <h2> Greetings <h2>
            OTP for the email ${email} is ${OTP}
            </html>`
        })

        return res("Sent email");

    })

}


module.exports = mailservice;