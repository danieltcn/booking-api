import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import usersRoute from "./routes/users";
import hotelsRoute from "./routes/hotels";
import roomsRoute from "./routes/rooms";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const connect = async () => {
  const uri = process.env.DB_URI || "localhost";
  try {
    await mongoose.connect(uri);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    // stack: err.stack,
  });
});

app.listen(port, () => {
  connect();
  console.log("Backend is up.");
});
