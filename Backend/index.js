import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import loginRoute from './routes/loginRoute.js';
import chatRoute from './routes/chatRoute.js';
import db from './db/db.js';


dotenv.config();
const app = express();
let port  = process.env.PORT || 5000; 

app.use(cors());
db;
app.use("/login",loginRoute);
app.use("/chat",chatRoute);
app.listen(port, ()=>{
    console.log(`App is running on the Port ${port}`);
})

