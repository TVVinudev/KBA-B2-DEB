import express from 'express';
import { userRoute } from './Routes/users.js';

const app = express();

const port = 8080;

app.use('/',userRoute)



app.listen(port,()=>{
    console.log("server running",port)
})