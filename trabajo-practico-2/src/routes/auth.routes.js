import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  profile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3, max: 20 })
      .withMessage("El username debe tener entre 3 y 20 caracteres"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
  ],
  validatorMiddleware,
  register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("usernameOrEmail")
      .notEmpty()
      .withMessage("Debe enviar usernameOrEmail"),
    body("password").notEmpty().withMessage("Debe enviar password"),
  ],
  validatorMiddleware,
  login
);

// GET /api/auth/profile
router.get("/profile", authMiddleware, profile);

// PUT /api/auth/profile
router.put("/profile", authMiddleware, updateProfile);

// POST /api/auth/logout
router.post("/logout", authMiddleware, logout);

export default router;
