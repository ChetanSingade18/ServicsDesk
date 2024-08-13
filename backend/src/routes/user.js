import express from 'express';
import UserController from '../controllers/usersControllers.js';
import Auth from "../common/auth.js";
import users from "../models/user.js";
import Message from "../models/message.js";

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

// Send message route
router.post('/message', Auth.validate, async (req, res) => {
    const { message } = req.body;
  
    const admin = await users.findOne({ role: 'admin' });
    if (!admin) return res.status(500).json({ message: 'Admin not found' });
  
    console.log("Message Req:", req.user);

    const newMessage = new Message({
      sender: req.user.id,
      receiver: req.user.role === 'admin' ? req.body.receiver : admin._id,
      message,
    });
  
    await newMessage.save();
    res.json({ message: 'Message sent' });
});

// Get chat history
router.get('/messages', Auth.validate, async (req, res) => {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id },
      ],
    })
      .populate('sender', 'userName')
      .populate('receiver', 'userName')
      .sort({ timestamp: 1 });
  
    res.json(messages);
  });

export default router;
