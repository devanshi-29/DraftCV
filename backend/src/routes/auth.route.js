const express=require("express")
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")
const User = require("../models/user.model");
const router=express.Router()

// Register
router.post('/register',authController.registerUser)

//login
router.post("/login",authController.loginUser);

//protected route
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

module.exports=router