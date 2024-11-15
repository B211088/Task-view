import { getAuth } from "firebase-admin/auth";

const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const accessToKen = authorizationHeader.split(" ")[1];
    getAuth()
      .verifyIdToken(accessToKen)
      .then((decodedToken) => {
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch((err) => {
        console.error("Invalid token:", err);
        res.status(403).json({ message: "Invalid token" });
      });
  } else {
    return res.status(401).json({ message: "Unauthoried" });
  }
};

export default authorizationJWT;
