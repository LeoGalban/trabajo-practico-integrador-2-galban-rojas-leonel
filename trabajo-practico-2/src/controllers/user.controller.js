import { User } from "../models/user.model.js";
import { Article } from "../models/article.model.js";
import { Comment } from "../models/comment.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    const usersWithArticles = await Promise.all(
      users.map(async (user) => {
        const articles = await Article.find({ author: user._id }).select(
          "title status createdAt"
        );
        const comments = await Comment.find({ author: user._id }).select(
          "content createdAt article"
        );

        return {
          ...user,
          articles,
          comments,
        };
      })
    );

    return res.status(200).json(usersWithArticles);
  } catch (error) {
    console.error("Error en getUsers:", error.message);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const articles = await Article.find({ author: user._id }).select(
      "title status createdAt"
    );
    const comments = await Comment.find({ author: user._id }).select(
      "content createdAt article"
    );

    return res.status(200).json({
      ...user,
      articles,
      comments,
    });
  } catch (error) {
    console.error("Error en getUserById:", error.message);
    return res.status(500).json({ message: "Error al obtener usuario" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, username, email } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        ...(role && { role }),
        ...(username && { username }),
        ...(email && { email }),
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error("Error en updateUserById:", error.message);
    return res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario not encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Usuario eliminado físicamente correctamente" });
  } catch (error) {
    console.error("Error en deleteUserById:", error.message);
    return res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
