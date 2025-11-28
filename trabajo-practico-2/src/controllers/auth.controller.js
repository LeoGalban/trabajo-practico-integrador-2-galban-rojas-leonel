import { User } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username o email ya en uso" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profile,
    });

    const token = generateToken({ id: user._id });

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Error en register:", error.message);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user || user.deletedAt) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id });

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.deletedAt) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Error en profile:", error.message);
    return res.status(500).json({ message: "Error al obtener perfil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile },
      { new: true }
    );

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Error en updateProfile:", error.message);
    return res.status(500).json({ message: "Error al actualizar perfil" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    console.error("Error en logout:", error.message);
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
};
