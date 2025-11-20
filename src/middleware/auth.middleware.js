import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyjwt = asyncHandler( async (req, res, next) => {

try {
        const token = await req.cookies?.accessToken || req.headers.
    Authorization?.replace("Bearer ","")
    
    if (!token){
        throw new ApiError (401, "Access Denied. No token provided");
    }


    // Agar valid ho → token decode ho jata hai:

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     Token sahi ho sakta hai, lekin user delete bhi ho sakta hai
//     Isliye DB me check karte hain ke user exist karta hai ya nahi

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError (401, "Invalid token. User not found");
    }

    req.user = user;
    next();
}
catch (error) {
    throw new ApiError (401, "Invalid or expired token");
}
})