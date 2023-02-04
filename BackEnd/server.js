const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser");
const _ = require("lodash");
const session = require("express-session");
const cors = require("cors");
const ejs = require("ejs");

const portConfig = require("./config/port");
const utils = require("./Service/utils");


let rootPath = path.join(__dirname , "../");

app.use(cors())
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
    email : email, type = string
    otp : otpGenerated, type = string
}*/

let users = [];




//Show main page login.html
app.get("/" , utils.redirectToDashBoardIfLoggedIn , (req, res) => {
    let pathForLoginhtml = path.join(__dirname , '../FrontEnd/Login Page/login.html');
    return res.sendFile(pathForLoginhtml);
})

app.get("/dashboard", utils.isUserLoggedIn , (req, res) => {
    return res.sendFile(path.join(__dirname , '../FrontEnd/Main Page/main.html'));
})


app.post("/login" , (req, res) => {
    

    let payload = req.body;

    if(!payload.email){
        res.status(400).send("Email not present");
    }

    if(payload.button === "isOtp"){

        //Load service's
        const otpService = require("./Service/otpservice");
        const otpServiceInst = new otpService();
        const mailService = require("./Service/mailservice");
        const mailServiceInst = new mailService();


        //Check if user already exists, if so send otp to user ->

        let isUserAlreadyPresent = utils.isAttributeAlreadyUsed(users, "email" , payload.email);

        if(isUserAlreadyPresent){
            //Send user Details via mail and redirect to handleButton
            return mailServiceInst.sendOTP(isUserAlreadyPresent.email , isUserAlreadyPresent.otp).then(function(){
                return res.render("handleButton.ejs" , {email : payload.email , error : false});
            })
        }
        
        let generatedOtp = otpServiceInst.generateOTP(users);

        let user = {
            email : payload.email,
            otp : generatedOtp.toString()
        }

        users.push(user);

        return mailServiceInst.sendOTP(user.email , user.otp).then(function(){
            return res.render("handleButton.ejs" , {email : payload.email , error : false});
        })


    }

    //Else if is login then 
    // 1) login and route to main.html to show the contents if login is correct
    // 2) If login is wrong, route to handleButton.ejs with a error prompt!
    
    let isVerifiedOtp = utils.checkOtp(users , payload.email , payload.otp);

    if(isVerifiedOtp){
        //Save session in req obj, route to main.html
        req.session.user = isVerifiedOtp;

        return res.redirect("/dashboard");
    }

    //If login is wrong
    return res.render("handleButton.ejs" , {email : payload , error : true});

})

app.get("/data" , (req, res) => {

    const dataService = require("./Service/dataservice");
    const dataServiceInst = new dataService();

    const data = dataServiceInst.getData();

    res.json(data);
})

app.get("/data/:searchBy" , (req, res) => {
    
    const dataService = require("./Service/dataservice");
    const dataServiceInst = new dataService();

    const filterBy = req.params.searchBy.toLowerCase();

    let filteredData = dataServiceInst.filterData(dataServiceInst.getData() , filterBy)

    res.json(filteredData);
})

app.post("/logout" , (req, res) => {
    console.log("logout is hit");
    req.session.destroy(function(err){
        if(err){
            return err;
        }

        res.redirect("/");
    })
})

app.get("/html/:country" , (req, res) => {

    const country = req.params.country;
    const countryDump = require("./data dump/country")

    let queriedCountry = _.find(countryDump , {Name : country})

    if(queriedCountry){
        return res.render("country.ejs" , queriedCountry);
    }

    return res.send("No country found");

})

//Load static files for html
app.get("/static/login" , (req , res) => {
    res.sendFile(rootPath + "FrontEnd/Login Page/login.js")
})

app.get("/static/mainjs" , (req, res) => {
    res.sendFile(rootPath + "FrontEnd/Main Page/main.js")
})

app.get("/static/maincss" , (req, res) => {
    res.sendFile(rootPath + "FrontEnd/Main Page/main.css")
})

app.get("/static/logincss" , (req, res) => [
    res.sendFile(rootPath + "FrontEnd/Login Page/login.css")
])



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