import { Router } from "express";
import { body, param } from "express-validator";
import {
  createComment,
  getCommentsByArticle,
  getMyComments,
  updateCommentById,
  deleteCommentById,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import { Comment } from "../models/comment.model.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

const router = Router();

// POST /api/comments (auth)
router.post(
  "/",
  authMiddleware,
  [
    body("content")
      .isLength({ min: 5, max: 500 })
      .withMessage("El contenido debe tener entre 5 y 500 caracteres"),
    body("articleId").isMongoId().withMessage("articleId inválido"),
  ],
  validatorMiddleware,
  createComment
);

// GET /api/comments/article/:articleId (auth)
router.get(
  "/article/:articleId",
  authMiddleware,
  [param("articleId").isMongoId().withMessage("articleId inválido")],
  validatorMiddleware,
  getCommentsByArticle
);

// GET /api/comments/my (auth)
router.get("/my", authMiddleware, getMyComments);

// PUT /api/comments/:id (solo autor o admin)
router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("content")
      .optional()
      .isLength({ min: 5, max: 500 })
      .withMessage("El contenido debe tener entre 5 y 500 caracteres"),
  ],
  validatorMiddleware,
  ownerOrAdminMiddleware((req) => Comment.findById(req.params.id), "author"),
  updateCommentById
);

// DELETE /api/comments/:id (solo autor o admin)
router.delete(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("ID inválido")],
  validatorMiddleware,
  ownerOrAdminMiddleware((req) => Comment.findById(req.params.id), "author"),
  deleteCommentById
);

export default router;
