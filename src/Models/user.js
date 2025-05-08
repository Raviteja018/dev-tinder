const mongoose = require('mongoose')
const validator = require("validator")

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:10,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        lowerCase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("not a strong Password")
            }
        }
    },
    age:{
        type:Number,
        min:18,
        max:50,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxz7qJ9pU6Xj2EJKaRDVz-9Bd0xh2LnMklGw&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url: " + value);
            }
        }
    },
    about:{
        type:String,
        default: "This is a default about the user",
    },
    skills:{
        type:[String],
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema);

module.exports = User 





