import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import "./firebaseConfig.js";
import "./helper/cron.js";

import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";
import { getAuth } from "firebase-admin/auth";

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

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

app.use(express.json());
app.use(
  cors(),
  authorizationJWT,
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { uid: res.locals.uid };
    },
  })
);

const URI = process.env.DATABASE_URL;

mongoose
  .connect(URI)
  .then(async () => {
    console.log("Connected to database successfully");
    await new Promise((resolve) => httpServer.listen(PORT, resolve));
    console.log(`Server started at ${PORT}`);
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
