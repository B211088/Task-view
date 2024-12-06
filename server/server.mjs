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
import cron from "node-cron";
import axios from "axios";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";
import authorizationJWT from "./middleware/authorizationJWT.js";
import authorRoute from "./routers/authorRoute.js";

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authorRoute);
app.use(
  authorizationJWT,
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { uid: res.locals.uid };
    },
  })
);
app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive!");
});

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

cron.schedule("*/5 * * * *", async () => {
  try {
    const response = await axios.get(`http://localhost:${PORT}/ping`);
    console.log("Ping tự gửi thành công:", response.status);
  } catch (error) {
    console.error("Ping tự gửi thất bại:", error.message);
  }
});

export default authorizationJWT;
