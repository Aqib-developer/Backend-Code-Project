import mongoose from "mongoose";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path : "./env"
}

)


connectDB();

// const app = express();

// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
//         app.on(error => {
//             console.log("Error in Db connection" ,error)
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log("server is runing on port" , process.env.PORT)
//         })

//     }
//     catch (error){
//         console.log("Error in DB Connection" , error)
//     }
// })()