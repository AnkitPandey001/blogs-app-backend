import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

export const dbConnect = (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  .then((res) => {
    console.log("Database Connected")
  }).catch((err)=>{
    console.log(err)
  })
};
