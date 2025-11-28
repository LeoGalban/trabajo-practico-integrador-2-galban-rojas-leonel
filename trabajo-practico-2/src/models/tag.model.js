import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    description: {
      type: String,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

export const Tag = mongoose.model("Tag", tagSchema);
