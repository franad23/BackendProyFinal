import  jwt  from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado." });
  }
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userIdFromToken = tokenDecoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
}