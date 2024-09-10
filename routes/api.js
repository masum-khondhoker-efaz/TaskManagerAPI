import express from "express";
const router = express.Router();

import * as TaskController from "../app/controllers/TaskController.js";
import * as UsersController from "../app/controllers/UsersController.js";
import AuthenticationMiddleware from "../app/middlewares/AuthenticationMiddleware.js";


//Users
router.post("/Registration", UsersController.Registration)
router.post("/Login", UsersController.Login)
router.get("/ProfileDetails",AuthenticationMiddleware, UsersController.ProfileDetails)
router.post("/ProfileUpdate",AuthenticationMiddleware, UsersController.ProfileUpdate)
router.get("/EmailVerify/:email", UsersController.EmailVerify)
router.post("/CodeVerify", UsersController.CodeVerify)
router.post("/ResetPassword", UsersController.ResetPassword)


//Task
router.post("/CreateTask", AuthenticationMiddleware,TaskController.CreateTask)
router.get("/UpdateTaskStatus/:id/:status", AuthenticationMiddleware,TaskController.UpdateTaskStatus)
router.get("/TaskListStatus/:status", AuthenticationMiddleware,TaskController.TaskListStatus)
router.get("/DeleteTask/:id", AuthenticationMiddleware,TaskController.DeleteTask)
router.get("/TaskListCounting", AuthenticationMiddleware,TaskController.TaskListCounting)


export default router;