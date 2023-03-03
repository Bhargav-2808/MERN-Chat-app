import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = mongoose.connect(process.env.URL,
{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB is connected");
}).catch((e)=>{
    console.log(e);
});

export default db;