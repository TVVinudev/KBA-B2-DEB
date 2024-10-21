import express,{json} from "express";
import { adminRoute } from "./routes/admin.js";




const app = express();

app.use(json());
app.use('/',adminRoute);


const port = 8000;


app.listen(port ,()=>{
    console.log('server running');
})