import UsersModel from '../models/UsersModel.js';
import {TokenEncode} from "../utilities/TokenUtility.js";
import SendEmail from "../utilities/EmailUtility.js";


export const Registration = async (req, res) => {

    try {
        let reqBody = req.body;
        await UsersModel.create(reqBody)
        return res.json({status: "Success", "Message": "Registration Successfully"})
    }
    catch (err){
        return res.json({status:"Failed","Message":err.toString()})
    }
}

export const Login = async (req, res) => {
    try {
        let reqBody = req.body;
        let data = await UsersModel.findOne(reqBody)
        if ( data == null){
            return res.json({status:"Login failed","Message": "User Not Found"})
        }
        else{
            let token = TokenEncode(data["email"],data["_id"])
            return res.json({status: "Success", "Message": "User Login Successfully",data:{token:token}})
        }

    }
    catch (err){
        return res.json({status:"Failed","Message":err.toString()})
    }
}

export const ProfileDetails = async (req, res) => {
    try {
        let user_id = req.headers['user_id'];
        let data=await UsersModel.findOne({"_id":user_id})
        return res.json({status:"Success",message:"Profile Details Successfully",data:data})
    }catch (err){
        return res.json({status:"Failed","Message":err.toString()})
    }
}

export const ProfileUpdate = async (req, res) => {

    try {
        let reqBody = req.body;
        let user_id = req.headers['user_id'];
        await UsersModel.updateOne({"_id":user_id},reqBody)
        return res.json({status: "Success", "Message": "User Profile Updated Successfully"})
    }
    catch (err){
        return res.json({status:"Failed","Message":err.toString()})
    }

}

export const EmailVerify = async (req, res) => {
    try {
        let email = req.params.email;
        let data = await UsersModel.findOne({email: email})
        if (data == null){
            return res.json({status:"Failed","Message": "User email does not exist"})
        }
        else {
            //Send OTP to Email
            let code = Math.floor(100000+Math.random()*900000)
            let EmailTo = data['email'];
            let EmailText = "Your code is " + code;
            let EmailSubject = "Task Manager Verification";
            await SendEmail(EmailTo,EmailText,EmailSubject);


            //Update OTP for user
            await UsersModel.updateOne({email: email}, {otp:code})
            return res.json({status:"Success","Message": "Email Verified. Check your mail inbox"})
        }
    }
    catch (err){
        return res.json({status:"Failed","Message":err.toString()})
    }
}

export const CodeVerify = async (req, res) => {

    try{
        let reqBody = req.body;
        let data = await UsersModel.findOne({email: reqBody['email'],otp:reqBody['otp']})
        if (data == null){
            return res.json({status:"Failed","Message":"Wrong verification code"})
        }else{
            return res.json({status:"Success",message:"Verification successful"})
        }
    }catch (e) {
        return res.json({status:"Failed","Message":e.toString()})
    }

}

export const ResetPassword = async (req, res) => {
    try{
        let reqBody = req.body;
        let data = await UsersModel.findOne({email: reqBody['email'],otp:reqBody['otp']})
        if (data == null){
            return res.json({status:"Failed","Message":"Wrong verification code"})
        }else{
            await UsersModel.updateOne({email: reqBody['email']},{otp:"0",password: reqBody['password']})

            return res.json({status:"Success",message:"Password reset successful"})
        }
    }catch (e) {
        return res.json({status:"Failed","Message":e.toString()})
    }
}

