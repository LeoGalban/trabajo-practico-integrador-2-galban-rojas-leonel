import { verifyToken } from "../helpers/jwt.helper.js";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user || user.deletedAt) {
      return res.status(401).json({ message: "Token inválido o usuario eliminado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};
