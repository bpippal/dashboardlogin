const otpGenerator = require("otp-generator"); 
const otpConfig = require("../config/otp");
const _ = require("lodash");
const utils = require("./utils")

function otpservice(){
    this.serviceName = "otpservice";
}


otpservice.prototype.generateOTP = function(users){

    let otpGenerated = otpGenerator.generate(otpConfig.length , {digits : true , upperCaseAlphabets : false , lowerCaseAlphabets : false , specialChars : false});

    if(utils.isAttributeAlreadyUsed(users , "otp" , otpGenerated)){
        return this.generateOTP(users)
    }else{
        return otpGenerated;
    }

}



module.exports = otpservice;