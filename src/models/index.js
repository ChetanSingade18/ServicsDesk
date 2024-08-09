import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

try {
    mongoose.connect(`mongodb://127.0.0.1:27017/ServicDesk`);
    console.log("mongoose connected successfully");
} catch (error) {
    console.log(error);
}

export default mongoose;
