import TaskModel from "../models/TaskModel.js";
import mongoose from "mongoose";

export const CreateTask = async (req, res) => {

    try{
        let user_Id = req.headers['user_id'];
        let requestBody = req.body;
        requestBody.user_id=user_Id;

        await TaskModel.create(requestBody);
        return  res.json({status: "Success", Message: "Task Created Successfully"})

    }catch (err){
        return res.json({status:"Failed",message:err.toString()});
    }
}

export const UpdateTaskStatus = async (req, res) => {
    try{
        let id = req.params.id;
        let status = req.params.status;
        let user_Id = req.headers['user_id'];

        await  TaskModel.updateOne({"_id":id,"user_id":user_Id},{status:status})
        return res.json({status:"Success",Message:"Task Updated Successfully"})
    }catch (err){
        res.json({status:"Failed","Message":err.toString()})
    }
}
export const TaskListStatus = async (req, res) => {
    try{
        let user_id = req.headers['user_id'];
        let status = req.params.status;
        let data = await TaskModel.find({user_id: user_id,status: status})
        return res.json({status:"Success",Message:"Task ListStatus Successfully",data:data})
    }
    catch (err){
        return res.json({status:"Failed","Message":err.toString()})
    }
}

export const DeleteTask = async (req, res) => {
    try{
        let id = req.params.id;
        let user_id = req.headers['user_id'];

        await TaskModel.deleteOne({"_id":id,"user_id":user_id})
        return res.json({status:"Success",Message:"Task Deleted Successfully"})

    }catch(err){
        return res.json({status:"Failed","Message":err.toString()})
    }
}



export const TaskListCounting = async (req, res) => {
    try{
        let ObjectId = mongoose.Types.ObjectId;
        let user_id = new ObjectId(req.headers['user_id']);

        let data = await TaskModel.aggregate([
            {$match:{user_id:user_id}},
            {$group:{_id:"$status",sum:{$count:{}}}}
        ])
        return res.json({status:"Success",Message:"Task counted Successfully",data:data})

    }catch(err){
        return res.json({status:"Failed","Message":err.toString()})
    }
}
