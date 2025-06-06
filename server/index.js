import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import ConnectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoute.js";
import { adminRouter } from "./routes/adminRoute.js";
import { healthCheckRouter } from "./routes/healthCheckRoute.js";

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

//health check
app.use('/api/server',healthCheckRouter)

//user routes
app.use("/api/user", userRouter);
//post routes
app.use('/api/post',postRouter)
//admin routes
app.use('/api/admin',adminRouter)

//db connection
ConnectDB();

//starting server
app.listen(PORT, () => {
  console.log(`Server Started http://localhost:${PORT}`);
});

