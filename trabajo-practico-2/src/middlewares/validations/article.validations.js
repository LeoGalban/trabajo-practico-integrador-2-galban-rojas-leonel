import { body } from "express-validator";
import mongoose from "mongoose";

export const articleValidations = [
  body("title")
    .isLength({ min: 3, max: 200 }).withMessage("El título debe tener entre 3 y 200 caracteres"),

  body("content")
    .isLength({ min: 50 }).withMessage("El contenido debe tener al menos 50 caracteres"),

  body("excerpt")
    .optional()
    .isLength({ max: 500 }).withMessage("El extracto no puede superar los 500 caracteres"),

  body("status")
    .optional()
    .isIn(["published", "archived"]).withMessage("El estado debe ser 'published' o 'archived'"),

  body("author")
    .custom((value, { req }) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("El author debe ser un ObjectId válido");
      }
      // Solo permitir si el autor coincide con el usuario autenticado (excepto admin)
      if (req.user.role !== "admin" && value !== req.user.id) {
        throw new Error("No podés crear artículos para otros usuarios");
      }
      return true;
    }),
];