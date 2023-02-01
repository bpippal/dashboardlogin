const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser");
const _ = require("lodash");

const portConfig = require("./config/port");
const mailservice = require("./Service/mailservice");

let rootPath = path.join(__dirname , "../");

app.use(express.static(rootPath));
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())







//Storing data at server level
/*Each user object is of format -> 
{
    email : emailId,
    otp : otpGenerated
}*/

let users = [];

//Show main page login.html
app.get("/" , express.static(rootPath) , (req, res) => {
    let pathForLoginhtml = path.join(__dirname , '../FrontEnd/Login Page/login.html');
    res.sendFile(pathForLoginhtml);
})


app.post("/login" , (req, res) => {

    if(!req.body.email){
        res.status(400).send("Email not sent");
    }

    //Load service's
    const otpService = require("./Service/otpservice");
    const otpServiceInst = new otpService();
    
    let generatedOtp = otpServiceInst.generateOTP(users);

    let user = {
        email : req.body.email,
        otp : generatedOtp
    }

    users.push(user);

    const mailService = require("./Service/mailservice");
    const mailServiceInst = new mailService();

    //Send the mail with otp

    res.json({key : generatedOtp});
})


//Load static files for html
app.get("/static/login" , (req , res) => {
    res.sendFile(rootPath + "FrontEnd/Login Page/login.js")
})


app.listen(portConfig.port , () => {
    console.log("Server is listening");
});