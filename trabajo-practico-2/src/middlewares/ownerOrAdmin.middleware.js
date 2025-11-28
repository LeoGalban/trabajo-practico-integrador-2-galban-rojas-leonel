// Middleware genérico: chequea si el usuario autenticado es dueño del recurso o admin.
// Recibe una función async que debe devolver el recurso (doc de Mongoose).

export const ownerOrAdminMiddleware = (getResource, ownerField = "author") => {
  return async (req, res, next) => {
    try {
      const resource = await getResource(req);

      if (!resource) {
        return res.status(404).json({ message: "Recurso no encontrado" });
      }

      const isOwner = resource[ownerField]?.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res
          .status(403)
          .json({ message: "No tenés permisos para modificar este recurso" });
      }

      // Guardamos el recurso en la request por si el controlador lo quiere reutilizar
      req.resource = resource;

      next();
    } catch (error) {
      console.error("Error en ownerOrAdminMiddleware:", error.message);
      res.status(500).json({ message: "Error interno de servidor" });
    }
  };
};
