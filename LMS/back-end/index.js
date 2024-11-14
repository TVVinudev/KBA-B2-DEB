import express from 'express';
import { adminRouter } from './Routes/adminRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors({
    origin:"http://127.0.0.1:5500" ,// for a particular port initilizze it before any use case 
    credentials:true
}));

app.use(cookieParser());

app.use('/',adminRouter);



const port = process.env.port;

app.listen(port,()=>{
    console.log('Server listerning from port ',port);
    
})