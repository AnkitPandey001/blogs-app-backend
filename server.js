
import express from "express"
import routes from './routes/routes.js';
import userRouter from "./routes/userRoutes.js";
import { dbConnect } from "./db/db.js";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'
import Postroutes from "./routes/postRoutes.js";
import cors from 'cors'
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const allowedOrigins = [
  'http://localhost:5173',  // Development
  'https://blogs-app-frontend-virid.vercel.app', // Production
];

const app = express();
app.get('/',(req,res)=>{
    res.send("Hello World")
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you need to send cookies
}));
//! databse;
dbConnect();
//! Routes 

app.use(cookieParser());
app.use('/api/auth',routes)
app.use('/api/user',userRouter)
app.use('/api/post',Postroutes)

//! listeing to server


const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started ${PORT}`)
})
