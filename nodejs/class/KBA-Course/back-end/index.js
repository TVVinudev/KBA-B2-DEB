import express,{json} from "express";
import { adminRoute } from "./routes/admin.js";
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express();

app.use(cors({
    origin:"*" // for a particular port initilizze it before any use case 
}));

app.use(json());
app.use('/',adminRoute);



const port = process.env.port;


app.listen(port ,()=>{
    console.log('server running',port);
})