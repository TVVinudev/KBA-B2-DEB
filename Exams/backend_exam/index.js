import { json } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { routes } from './routes/mainRoute.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}))


app.use(json());
app.use('/',routes)


const port = process.env.port;


app.listen(port, () => {
    console.log('Server Running', port);

})