import { getAuth } from "firebase-admin/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(accessToken);
    res.locals.uid = decodedToken.uid;
    return next();
  } catch (firebaseError) {
    console.error("Firebase Token Invalid:", firebaseError);
  }

  try {
    const decodedJwt = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    res.locals.uid = decodedJwt.userId;
    return next();
  } catch (jwtError) {
    console.error("Invalid JWT:", jwtError);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authorizationJWT;
