import { Router } from "express";
import { body, param } from "express-validator";
import {
  createArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  updateArticleById,
  deleteArticleById,
  addTagToArticle,
  removeTagFromArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import { Article } from "../models/article.model.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

const router = Router();

// POST /api/articles (auth)
router.post(
  "/",
  authMiddleware,
  [
    body("title")
      .isLength({ min: 3, max: 200 })
      .withMessage("El título debe tener entre 3 y 200 caracteres"),
    body("content")
      .isLength({ min: 50 })
      .withMessage("El contenido debe tener al menos 50 caracteres"),
  ],
  validatorMiddleware,
  createArticle
);

// GET /api/articles (auth)
router.get("/", authMiddleware, getArticles);

// GET /api/articles/my (auth)
router.get("/my", authMiddleware, getMyArticles);

// GET /api/articles/:id (auth)
router.get(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("ID inválido")],
  validatorMiddleware,
  getArticleById
);

// PUT /api/articles/:id (solo autor o admin)
router.put(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("ID inválido")],
  validatorMiddleware,
  ownerOrAdminMiddleware((req) => Article.findById(req.params.id)),
  updateArticleById
);

// DELETE /api/articles/:id (solo autor o admin)
router.delete(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("ID inválido")],
  validatorMiddleware,
  ownerOrAdminMiddleware((req) => Article.findById(req.params.id)),
  deleteArticleById
);

// POST /api/articles/:articleId/tags/:tagId (solo autor o admin)
router.post(
  "/:articleId/tags/:tagId",
  authMiddleware,
  [
    param("articleId").isMongoId().withMessage("articleId inválido"),
    param("tagId").isMongoId().withMessage("tagId inválido"),
  ],
  validatorMiddleware,
  ownerOrAdminMiddleware((req) => Article.findById(req.params.articleId)),
  addTagToArticle
);

// DELETE /api/articles/:articleId/tags/:tagId (solo autor o admin)
router.delete(
  "/:articleId/tags/:tagId",
  authMiddleware,
  [
    param("articleId").isMongoId().withMessage("articleId inválido"),
    param("tagId").isMongoId().withMessage("tagId inválido"),
  ],
  validatorMiddleware,
  ownerOrAdminMiddleware((req) => Article.findById(req.params.articleId)),
  removeTagFromArticle
);

export default router;
