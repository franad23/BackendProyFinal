import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


export async function connectDB () {
    try {
        await mongoose.connect(`mongodb+srv://franad2310:${process.env.MONGODB_PASSWORD}@cluster0.ztedvyq.mongodb.net/?retryWrites=true&w=majority`);
        console.log("Se conecto a DB");
    } catch (error) {
        console.log(error);
    }
}