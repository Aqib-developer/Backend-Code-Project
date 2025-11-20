
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId) => {
    
  try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save( { validateBeforeSave : false });
  return { accessToken, refreshToken };

  }
  catch (error) {

    throw new ApiError(500, "Failed to generate tokens");

}
};



const registerUser = asyncHandler( async ( req, res) =>{
  const {fullname, username, email, password} = req.body;
  console.log("email is here" ,email)


  if([fullname, username, email, password].some((feild) => feild?.trim() === "")){
    throw new ApiError(400, "All feilds are required")
  }

  // Simple Email Validation

  if(email.includes("@") === false){
    throw new ApiError(400, "Invalid email address");
  }

const existeduser = await User.findOne({
  $or: [{ email }, { username}]
}
)
if(existeduser){
  throw new ApiError(409, "Email or Usernam already exists");
}

console.log("existed user", existeduser);

// const avatarLocalPath = req.files?.pic[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!coverImageLocalPath){
  throw new ApiError(400, "Avatar file is required");
}

// const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

// if(!avatar){
//   throw new ApiError(400, "Avatar file is required");
// }


const user = await User.create(
  {
    fullname,
    // pic : avatar.url,
    coverImage : coverImage?.url || " ",
    email,
    password,
    username: username.toLowerCase(),
  }
)

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)

if(!createdUser){
  throw new ApiError (500, "Failed to create user");
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered successfully")
)});

const loginUser = asyncHandler(async (req, res) => {
  // get data from req.body
  // validate data username email and password
  // check user existence
  // compare password
  // generate Access and Refresh tokens
  // send cookies



    // get data from req.body
  const { username, email } = req.body;

    // validate data username email and password
  if(!(username || email)){
    throw new ApiError (400, "Username ad email are required");

  }

  // check user existence

  const user = User.findOne(
    {
      $or: [{ email }, { username }]
    }
  )

  if(!user){
    throw new ApiError(404, "User not existed");
  }

  // compare password

  const isPasswordValid = await user.isPasswordCorrect(passwaord);

  if(!isPasswordValid){
    throw new ApiError(401, "Invalid credentials");
  }


  // generate Access and Refresh tokens

 const { accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

 const validlogin = await User.findById(user._id).select("-password -refreshToken");
// by using this to ensure that tokens are sent only over secure connections and only server-side is update it

 const options = {
  httpOnly : true,
  secure : true
 }

 // send a cookie response
 return res.status(200).cookie("accessToken", accessToken, options).
 cookie("refreshToken", refreshToken, options)
 .json(
  new ApiResponse(
    200,
    {
      user : validlogin, accessToken, refreshToken

    },
     "User Logged in successfully"
  )
 )
  
})

const logoutUser = asyncHandler(async (req,res) => {

})
export {
    registerUser, 
    loginUser,
    logoutUser
}