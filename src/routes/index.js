import express from 'express';
import UserRoutes from './user.js';
import TicketsRoutes from './tickets.js';
import TaskRoutes from './task.js';
import fileUpload from '../controllers/fileUpload.js';
import upload from '../multerconfig/storageConfig.js';
const router = express.Router();

router.use('/user', UserRoutes);
router.use('/tickets', TicketsRoutes);
router.use('/task', TaskRoutes);
router.post('/upload', upload.single('file'), fileUpload);

export default router;
