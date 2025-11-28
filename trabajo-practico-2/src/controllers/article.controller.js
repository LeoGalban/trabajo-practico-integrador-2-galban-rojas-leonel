import { Article } from "../models/article.model.js";
import { Comment } from "../models/comment.model.js";
import { Tag } from "../models/tag.model.js";

export const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, status, tags } = req.body;

    const article = await Article.create({
      title,
      content,
      excerpt,
      status,
      author: req.user._id,
      tags,
    });

    return res
      .status(201)
      .json({ message: "Artículo creado correctamente", article });
  } catch (error) {
    console.error("Error en createArticle:", error.message);
    return res.status(500).json({ message: "Error al crear artículo" });
  }
};

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" })
      .populate("author", "username email")
      .populate("tags", "name");

    return res.status(200).json(articles);
  } catch (error) {
    console.error("Error en getArticles:", error.message);
    return res.status(500).json({ message: "Error al obtener artículos" });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id)
      .populate("author", "username email")
      .populate("tags", "name description");

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    const comments = await Comment.find({ article: article._id }).populate(
      "author",
      "username email"
    );

    return res.status(200).json({ ...article.toObject(), comments });
  } catch (error) {
    console.error("Error en getArticleById:", error.message);
    return res.status(500).json({ message: "Error al obtener artículo" });
  }
};

export const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id }).populate(
      "tags",
      "name"
    );

    return res.status(200).json(articles);
  } catch (error) {
    console.error("Error en getMyArticles:", error.message);
    return res.status(500).json({ message: "Error al obtener tus artículos" });
  }
};

export const updateArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status, tags } = req.body;

    const article = await Article.findByIdAndUpdate(
      id,
      { title, content, excerpt, status, tags },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Artículo actualizado correctamente", article });
  } catch (error) {
    console.error("Error en updateArticleById:", error.message);
    return res.status(500).json({ message: "Error al actualizar artículo" });
  }
};

export const deleteArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findOneAndDelete({ _id: id });

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    // Comentarios ya se eliminan en cascada desde el pre hook del modelo Article
    return res
      .status(200)
      .json({ message: "Artículo y comentarios asociados eliminados" });
  } catch (error) {
    console.error("Error en deleteArticleById:", error.message);
    return res.status(500).json({ message: "Error al eliminar artículo" });
  }
};

export const addTagToArticle = async (req, res) => {
  try {
    const { articleId, tagId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    if (!article.tags.includes(tagId)) {
      article.tags.push(tagId);
      await article.save();
    }

    return res
      .status(200)
      .json({ message: "Etiqueta agregada al artículo", article });
  } catch (error) {
    console.error("Error en addTagToArticle:", error.message);
    return res
      .status(500)
      .json({ message: "Error al agregar etiqueta al artículo" });
  }
};

export const removeTagFromArticle = async (req, res) => {
  try {
    const { articleId, tagId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    article.tags = article.tags.filter(
      (t) => t.toString() !== tagId.toString()
    );
    await article.save();

    return res
      .status(200)
      .json({ message: "Etiqueta removida del artículo", article });
  } catch (error) {
    console.error("Error en removeTagFromArticle:", error.message);
    return res
      .status(500)
      .json({ message: "Error al remover etiqueta del artículo" });
  }
};
