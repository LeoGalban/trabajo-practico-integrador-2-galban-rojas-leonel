import { body } from "express-validator";
import mongoose from "mongoose";

export const userValidations = [
  body("username")
    .isLength({ min: 3, max: 20 }).withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric().withMessage("El nombre de usuario solo puede contener letras y números"),

  body("email")
    .isEmail().withMessage("Debe ser un correo válido"),

  body("password")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/).withMessage("Debe incluir al menos una mayúscula")
    .matches(/[a-z]/).withMessage("Debe incluir al menos una minúscula")
    .matches(/[0-9]/).withMessage("Debe incluir al menos un número"),

  body("role")
    .optional()
    .isIn(["user", "admin"]).withMessage("El rol debe ser 'user' o 'admin'"),

  // Perfil embebido
  body("profile.firstName")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/).withMessage("El nombre solo puede contener letras"),

  body("profile.lastName")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/).withMessage("El apellido solo puede contener letras"),

  body("profile.biography")
    .optional()
    .isLength({ max: 500 }).withMessage("La biografía no puede superar los 500 caracteres"),

  body("profile.avatarUrl")
    .optional()
    .isURL().withMessage("El avatar debe ser una URL válida"),
];