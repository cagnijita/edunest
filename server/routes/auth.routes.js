import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
