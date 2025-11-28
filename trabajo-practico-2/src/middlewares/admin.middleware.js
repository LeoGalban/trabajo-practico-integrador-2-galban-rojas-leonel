export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Solo administradores pueden realizar esta acción" });
  }
  next();
};
