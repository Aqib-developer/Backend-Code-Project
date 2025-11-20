import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js"
import { verifyjwt } from "../middleware/auth.middleware.js"
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "pic",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1

        }
    ]),
    registerUser
)

router.route("login").post(loginUser);

router.route("/logout").post(verifyjwt, logoutUser)



export default router