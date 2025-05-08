const validator = require('validator')

const validSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("not a strong password");
    }
}

const validateEditProfileData = (req) => {

    const allowedEditFields = ["firstName", "LastName", "password", "age", "gender", "photoUrl", "about", "skills"];

    const isAllowedFields = Object.keys(req.body).every( field => allowedEditFields.includes(field));

    return isAllowedFields;
}

module.exports = {validSignUpData, validateEditProfileData}