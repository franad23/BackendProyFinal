import mongoose, { Schema } from "mongoose"


const userSchema = new mongoose.Schema ({
    userfirstname: {
        type:String,
        require: true,
        trim: true
    },
    userlastname: {
        type:String,
        require: true,
        trim: true
    },
    email: {
        type:String,
        require: true,
        unique: true
    },
    password: {
        type:String,
        require: true,
    },
    isVerify: {
        type:Boolean,
        require: true,
    },
    userPlan: {
        type:String,
        require: true,
    }
}, {
    timestamps:true, 
    versionKey: false // Deshabilitar la generación del campo "__v"
});

export default mongoose.model('UsersFinalProject', userSchema)