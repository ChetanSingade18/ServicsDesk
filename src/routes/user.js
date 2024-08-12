import express from 'express';
import UserController from '../controllers/usersControllers.js';
import Auth from "../common/auth.js";

const router = express.Router();

//loginRoutes
router.post('/signup', UserController.create);
router.post('/login', UserController.login);

//not used
router.post("/register", Auth.validate, UserController.registerUser);
router.get("/getdata", UserController.getUserData);
router.get("/getuser/:id", UserController.getIndividualUser);

//update and delete routes
router.put("/updateuser/:id", Auth.validate, UserController.updateUserData);
router.delete("/deleteuser/:id", UserController.deleteUser);

//Password Reset Routes
router.post("/forgotpassword", UserController.forgetpassword);
router.post("/resetpassword", UserController.resetpassword);

export default router;
