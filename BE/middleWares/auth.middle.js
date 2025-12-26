import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "token is required" });
    }
    const { id } = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: id }).select('+Phone');

    // cjeck everything is ok
    req.user = user;

    return next();
  } catch (error) {
    res.status(500).json({ message: "middleware error", error: error.message });
  }
};

export default authMiddleware;
