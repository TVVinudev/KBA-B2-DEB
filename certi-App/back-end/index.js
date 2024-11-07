import express, { json } from 'express';
import { userRoute } from './Routes/users.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
dotenv.config();

const port = process.env.port;

app.use(cors({
    origin:"http://127.0.0.1:5500" ,// for a particular port initilizze it before any use case 
    credentials:true
}));

app.use(cookieParser());
app.use(json());


app.use('/', userRoute)



app.listen(port, () => {
    console.log("server running", port)
})