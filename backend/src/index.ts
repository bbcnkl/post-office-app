import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import shipmentRoutes from "./routes/shipmentRoutes";
import postOfficeRoutes from "./routes/postOfficeRoutes";
import cors from "cors";
import fs from "fs";
import path from "path";
import { PostOfficeModel } from "./models/PostOffice";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/shipment", shipmentRoutes);
app.use("/api/post-office", postOfficeRoutes);

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      initializePostoffices();
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

async function initializePostoffices() {
  try {
    const count = await PostOfficeModel.countDocuments();

    if (count === 0) {
      console.log("No post offices found, adding default postoffices...");
      const filePath = path.join(__dirname, "data/post-offices.json");
      const data = fs.readFileSync(filePath, "utf8");
      const postoffices = JSON.parse(data);
      await PostOfficeModel.insertMany(postoffices);
    }
  } catch (err) {
    console.error("Error initializing postoffices:", err);
  }
}
