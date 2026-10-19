const express=require("express")
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")
const router=express.Router()

// Register
router.post('/register',authController.registerUser)

//login
router.post("/login",authController.loginUser);

//protected route
router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Authenticated successfully",
        userId: req.user.id
    });
});

module.exports=router