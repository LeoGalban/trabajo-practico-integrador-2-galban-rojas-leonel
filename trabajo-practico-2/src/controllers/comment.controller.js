import { Comment } from "../models/comment.model.js";
import { Article } from "../models/article.model.js";

export const createComment = async (req, res) => {
  try {
    const { content, articleId } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      article: articleId,
    });

    return res
      .status(201)
      .json({ message: "Comentario creado correctamente", comment });
  } catch (error) {
    console.error("Error en createComment:", error.message);
    return res.status(500).json({ message: "Error al crear comentario" });
  }
};

export const getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const comments = await Comment.find({ article: articleId }).populate(
      "author",
      "username email"
    );

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error en getCommentsByArticle:", error.message);
    return res
      .status(500)
      .json({ message: "Error al obtener comentarios del artículo" });
  }
};

export const getMyComments = async (req, res) => {
  try {
    const comments = await Comment.find({ author: req.user._id }).populate(
      "article",
      "title"
    );

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error en getMyComments:", error.message);
    return res
      .status(500)
      .json({ message: "Error al obtener tus comentarios" });
  }
};

export const updateCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Comentario actualizado correctamente", comment });
  } catch (error) {
    console.error("Error en updateCommentById:", error.message);
    return res
      .status(500)
      .json({ message: "Error al actualizar comentario" });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteCommentById:", error.message);
    return res
      .status(500)
      .json({ message: "Error al eliminar comentario" });
  }
};
