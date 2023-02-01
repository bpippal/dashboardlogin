const otpGenerator = require("otp-generator"); 
const otpConfig = require("../config/otp");
const _ = require("lodash");

function otpservice(){
    this.serviceName = "otpservice";
}


otpservice.prototype.generateOTP = function(users){

    let otpGenerated = otpGenerator.generate(otpConfig.length , {digits : true , upperCaseAlphabets : false , lowerCaseAlphabets : false , specialChars : false});

    if(this.isOtpAlreadyUsed(users , otpGenerated)){
        return this.generateOTP(users)
    }else{
        return otpGenerated;
    }

}

otpservice.prototype.isOtpAlreadyUsed = function(users , otp){
    return _.find(users, {otp : otp})
}


module.exports = otpservice;