import mongoose from "mongoose";
import { Comment } from "./comment.model.js";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      minlength: 50,
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["published", "archived"],
      default: "published",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

// Eliminación en cascada de comentarios al borrar un artículo
articleSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
      await Comment.deleteMany({ article: doc._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const Article = mongoose.model("Article", articleSchema);
