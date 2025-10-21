import multer from "multer";
import path from "path";

// Configure storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Folder where uploaded files will be temporarily stored
    cb(null, "./public/temp/");
  },
  filename: function (req, file, cb) {
    // Save file with its original name
    cb(null, file.originalname);
  },
});

// Create the multer upload middleware
export const upload = multer({
  storage,
});

export default upload;
