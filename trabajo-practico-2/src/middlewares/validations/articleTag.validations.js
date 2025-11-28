import { param } from "express-validator";
import mongoose from "mongoose";
import { TagModel } from "../models/tag.model.js";
import { ArticleModel } from "../models/article.model.js";

export const articleTagValidations = [
  param("articleId")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("ID de artículo inválido");
      }
      const article = await ArticleModel.findById(value);
      if (!article) {
        throw new Error("El artículo no existe");
      }
      return true;
    }),

  param("tagId")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("ID de etiqueta inválido");
      }
      const tag = await TagModel.findById(value);
      if (!tag) {
        throw new Error("La etiqueta no existe");
      }
      return true;
    }),
];