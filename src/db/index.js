import mongoose from "mongoose";
import {DB_Name} from "../constant.js";

const connectDB = async()=>{
    try{ 
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log("MongoDB connected" , connectionInstance.connection.host)

    }
    catch(error){
        console.log("Error in DB Connection" , error);
        process.exit(1);    
    }
}
export default connectDB;