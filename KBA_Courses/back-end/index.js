import express from 'express';

const app = express();
const port = 4000


app.listen(port,()=>{  // call back function, it listering the server
    console.log(`server is listening to port ${port}`);
})