import jwt from 'jsonwebtoken';
import User from "../models/user.js";

export const protectRoute = async (req, res, next) => {
  try {
 
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: "Unauthorized User"
      });
    }

    const token = authHeader.split(' ')[1]; 
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        error: "Unauthorized User: Invalid token"
      });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized User: User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};
