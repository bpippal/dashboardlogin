const express = require("express");
const app = express();
const path = require("path");

const portConfig = require("./config/port")

let rootPath = path.join(__dirname , "../");

app.use(express.static(rootPath));

//Show main page login.html
app.get("/" , express.static(rootPath) , (req, res) => {
    let pathForLoginhtml = path.join(__dirname , '../FrontEnd/Login Page/login.html');
    res.sendFile(pathForLoginhtml);
})

app.get("/static/login" , (req , res) => {
    res.sendFile(rootPath + "FrontEnd/Login Page/login.js")
})


app.listen(portConfig.port , () => {
    console.log("Server is listening");
});