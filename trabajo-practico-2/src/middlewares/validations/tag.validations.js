import { body } from "express-validator";

export const tagValidations = [
  body("name")
    .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .matches(/^[^\s]+$/).withMessage("El nombre no puede contener espacios"),

  body("description")
    .optional()
    .isLength({ max: 200 }).withMessage("La descripción no puede superar los 200 caracteres"),
];