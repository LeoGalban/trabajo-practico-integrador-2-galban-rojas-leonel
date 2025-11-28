import { body } from "express-validator";
import mongoose from "mongoose";
import { ArticleModel } from "../../models/article.model.js";

export const commentValidations = [
  body("content")
    .isLength({ min: 5, max: 500 }).withMessage("El comentario debe tener entre 5 y 500 caracteres"),

  body("author")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("El author debe ser un ObjectId válido");
      }
      return true;
    }),

  body("article")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("El article debe ser un ObjectId válido");
      }

      // Verificar que el artículo exista
      const article = await ArticleModel.findById(value);
      if (!article) {
        throw new Error("El artículo especificado no existe");
      }

      return true;
    }),
];