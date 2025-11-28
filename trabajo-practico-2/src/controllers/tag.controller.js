import { Tag } from "../models/tag.model.js";
import { Article } from "../models/article.model.js";

export const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ message: "Ya existe una etiqueta con ese nombre" });
    }

    const tag = await Tag.create({ name, description });

    return res
      .status(201)
      .json({ message: "Etiqueta creada correctamente", tag });
  } catch (error) {
    console.error("Error en createTag:", error.message);
    return res.status(500).json({ message: "Error al crear etiqueta" });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().lean();
    return res.status(200).json(tags);
  } catch (error) {
    console.error("Error en getTags:", error.message);
    return res.status(500).json({ message: "Error al obtener etiquetas" });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id).lean();

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    const articles = await Article.find({ tags: tag._id }).select(
      "title status author createdAt"
    );

    return res.status(200).json({ ...tag, articles });
  } catch (error) {
    console.error("Error en getTagById:", error.message);
    return res.status(500).json({ message: "Error al obtener etiqueta" });
  }
};

export const updateTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const tag = await Tag.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    return res
      .status(200)
      .json({ message: "Etiqueta actualizada correctamente", tag });
  } catch (error) {
    console.error("Error en updateTagById:", error.message);
    return res.status(500).json({ message: "Error al actualizar etiqueta" });
  }
};

export const deleteTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    // eliminación en cascada N:M: remover tag de todos los artículos
    await Article.updateMany(
      { tags: tag._id },
      { $pull: { tags: tag._id } }
    );

    return res
      .status(200)
      .json({ message: "Etiqueta eliminada y removida de los artículos" });
  } catch (error) {
    console.error("Error en deleteTagById:", error.message);
    return res.status(500).json({ message: "Error al eliminar etiqueta" });
  }
};
