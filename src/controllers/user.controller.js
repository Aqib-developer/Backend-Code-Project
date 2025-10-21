import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler( async ( req, res) =>{
  const {fullname, username, email, password} = req.body;
  console.log("email is here" ,email)

  if([fullname, username, email, password].some((feild) => feild?.trim() == "")){
    throw new ApiError(400, "All feilds are required")
  }
})

const existeduser = User.findOne({
  $or: [{ email }, { username}]
}
)

if(existeduser){
  throw new ApiError(409, "Email or Usernam already exists");
}

console.log("existed user", existeduser);

const localAvatar = req.files?.avatar[0].path;
const localCoverImage = req.files?.coverImage[0].path;

if(!localAvatar){
  throw new ApiError(400, "Avatar file is required");
}

const avatar = await uploadOnCloudinary(localAvatar);
const coverImage = await uploadOnCloudinary(localCoverImage);

if(!avatar){
  throw new ApiError(500, "Failed to upload avatar image");
}

const user = User.create(
  {
    fullname,
    avatar : avatar.url,
    coverImage : coverImage?.url || " ",
    email,
    password,
    username: username.toLowerCase(),
  }
)

const createdUser = User.findById(user._id).select(
  "-password -refreshToken"
)

if(!createdUser){
  throw new ApiError (500, "Failed to create user");
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered successfully")
)

export {
    registerUser,
  
}