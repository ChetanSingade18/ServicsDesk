import express from 'express'
import UserController from '../controllers/usersControllers.js'
import upload from "../multerconfig/storageConfig.js"
import Auth from "../common/auth.js"
const router = express.Router()

//loginRoutes
router.post('/signup',UserController.create)
router.post('/login',UserController.login)


router.post("/register",Auth.validate,UserController.registerUser)
router.get("/getdata",UserController.getUserData)
router.get("/getuser/:id",UserController.getIndividualUser)

router.put("/updateuser/:id",Auth.validate,UserController.updateUserData)
router.delete("/deleteuser/:id",UserController.deleteUser)
router.post ("/resetpassword",UserController.resetpassword)
router.post("/reset-password",UserController.passwordtoken)

export default router