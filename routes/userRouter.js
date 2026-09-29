const express = require("express")
const router = express.Router()
const UserController = require("../controllers/user.js")
const {auth} = require("../middleware/auth.js")
const multer = require("multer")

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./upload/avatars")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/register",UserController.register)
router.post("/login",UserController.login)
router.get("/profile/:id",auth,UserController.profile)
router.put("/update",auth,UserController.update)
router.post("/upload-avatar", auth, upload.single("file0"), UserController.upload);
router.get("/avatar",UserController.avatar)

module.exports = router