import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    biography: {
      type: String,
      maxlength: 500,
    },
    avatarUrl: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profile: profileSchema,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ignorar usuarios eliminados lógicamente en consultas "normales"
userSchema.pre(/^find/, function (next) {
  if (!this.getFilter().hasOwnProperty("deletedAt")) {
    this.where({ deletedAt: null });
  }
  next();
});

export const User = mongoose.model("User", userSchema);
