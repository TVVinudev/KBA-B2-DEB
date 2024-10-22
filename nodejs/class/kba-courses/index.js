import express,{json} from "express";
import { adminRoute } from "./routes/admin.js";
import dotenv from 'dotenv'


dotenv.config();
const app = express();

app.use(json());
app.use('/',adminRoute);


const port = process.env.port;


app.listen(port ,()=>{
    console.log('server running',port);
})