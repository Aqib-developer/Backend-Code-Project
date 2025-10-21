import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Custom uploader for local files
export const uploadOnCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("✅ File successfully uploaded to Cloudinary:", response.url);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Remove the file from local uploads folder if upload fails
    fs.unlinkSync(filePath);
    return null;
  }
};

export { uploadOnCloudinary };
