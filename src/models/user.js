import mongoose from "./index.js";
// import  validator from "validator"

// const validateEmail = (e)=>{
//     var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

//     return emailPattern.test(e)
// }
// const validateNumber =(e)=>{
//     const phoneRegex = /^[0-9]{10}$/; 
//     return phoneRegex.test(e)
// }

//       // Access the 'password' field using 'this'
//       return e ==;

// }
const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    mobile: {
        type: String
    },
    userPhotoUrl: {
        type: String
    },
    employeeId: {
        type: String
    },
    address: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
}, {
    _id: false
});

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active',

    },
    role: {
        type: String,
        default: 'user'
    },
    employeeDetails: employeeSchema,
    datecreated: Date,
    dateUpdated: Date

}, {
    collection: 'users',
    versionKey: false,
    timestamps: true
});

const userModel = mongoose.model('users', userSchema);
export default userModel;
