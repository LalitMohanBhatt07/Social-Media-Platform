import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();
import connectDb from "./Utils/db.js";
import userRote from "./routes/userRote.js"
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
};
app.options('*', cors(corsOptions));


app.use(cors(corsOptions));

app.use("/api/v1/user", userRote);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I am Coming from backend",
    success: true
  });
});

app.listen(PORT, () => {
  connectDb();
  console.log(`Server listening at port ${PORT}`);
});
