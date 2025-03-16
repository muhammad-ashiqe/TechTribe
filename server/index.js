import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import ConnectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoute.js";

//env
configDotenv();

//express and port
const app = express();
const PORT = process.env.PORT || 7000;

//cross platform access and json sharing
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("api is working");
});

//user routes
app.use("/api/user", userRouter);
//post routes
app.use('/api/post',postRouter)

//db connection
await ConnectDB();

//starting server
app.listen(PORT, () => {
  console.log(`Server Started http://localhost:${PORT}`);
});
