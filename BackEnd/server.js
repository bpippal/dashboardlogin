const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser");
const _ = require("lodash");
const session = require("express-session");

const portConfig = require("./config/port");
const mailservice = require("./Service/mailservice");

let rootPath = path.join(__dirname , "../");

app.use(session({
    secret : "Bharat",
    resave : false,
    saveUninitialized : false
}))
app.use(express.static(rootPath));
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.set('view-engine', 'ejs');





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

    console.log("/login is hit")

    let payload = req.body;
    console.log("🚀 ~ file: server.js:46 ~ app.post ~ payload", payload)

    if(!payload.email){
        res.status(400).send("Email not present");
    }

    if(payload.button === "isOtp"){

        console.log("insinde isOtp");

        //Generate OTP and send mail and route back to login.html with some prompt message
        //Load service's
        const otpService = require("./Service/otpservice");
        const otpServiceInst = new otpService();
        
        let generatedOtp = otpServiceInst.generateOTP(users);

        let user = {
            email : payload.email,
            otp : generatedOtp
        }

        users.push(user);

        const mailService = require("./Service/mailservice");
        const mailServiceInst = new mailService();

        //Send the mail with otp
        res.render("handleButton.ejs" , {email : payload.email});
    }

    //Else if is login then 
    // 1) login and route to main.html to show the contents if login is correct
    // 2) If login is wrong, route to handleButton.ejs with a error prompt!
    

})


//Load static files for html
app.get("/static/login" , (req , res) => {
    res.sendFile(rootPath + "FrontEnd/Login Page/login.js")
})



//Get otp from endpoint
app.get("/user/:userId" , (req, res) => {
    
    let queriedUser = _.find(users, {email : req.params.userId});

    if(queriedUser){
        return res.json(queriedUser);
    }

    return res.status(400).send("User Not found");

})


app.listen(portConfig.port , () => {
    console.log(`Server is listening on Port ${portConfig.port}`);
});