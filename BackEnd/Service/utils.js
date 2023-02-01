const _ = require("lodash");

function isAttributeAlreadyUsed(collection , field, value){
    let queryObj = {};
    queryObj[field] = value;

    return _.find(collection , queryObj);
}

function checkOtp(users , email , otp){
    return _.find(users , {email , otp});
}

function isUserLoggedIn (req , res , next){
    if(req.session.user){
        //User is logged in 
        return next();
    }

    return res.redirect("/");
}

function redirectToDashBoardIfLoggedIn(req , res , next){
    if(req.session.user){
        return res.redirect("/dashboard");
    }

    return next();
}

module.exports = {
    isAttributeAlreadyUsed : isAttributeAlreadyUsed,
    checkOtp : checkOtp,
    isUserLoggedIn : isUserLoggedIn,
    redirectToDashBoardIfLoggedIn : redirectToDashBoardIfLoggedIn
}