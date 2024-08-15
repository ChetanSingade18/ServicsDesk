import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

try {
    mongoose.connect(`mongodb+srv://hackathon:kfintech_hackathon@cluster0.yag4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    console.log("mongoose connected successfully");
} catch (error) {
    console.log(error);
}

export default mongoose;
