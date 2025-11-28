import { Router } from "express";
import { param, body } from "express-validator";
import {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

const router = Router();

// Todas las rutas de users son solo para admin

router.get("/", authMiddleware, adminMiddleware, getUsers);

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [param("id").isMongoId().withMessage("ID inválido")],
  validatorMiddleware,
  getUserById
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Rol inválido"),
  ],
  validatorMiddleware,
  updateUserById
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [param("id").isMongoId().withMessage("ID inválido")],
  validatorMiddleware,
  deleteUserById
);

export default router;
