import express from 'express';
import { userRoute } from './Routes/users.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const port = process.env.port;

app.use('/',userRoute)



app.listen(port,()=>{
    console.log("server running",port)
})