import express from 'express';
import cors from 'cors';
import rateLimit    from "express-rate-limit";
import router from './routes/api.js';
import helmet from 'helmet';
import mongoose from 'mongoose';
import {
    DATABASE_URL,
    MAX_JSON_SIZE,
    PORT,
    REQUEST_NUMBER,
    REQUEST_TIME,
    URL_ENCODE,
    WEB_CACHE
} from "./app/config/config.js";


const app = express();


// App use default middlewares
app.use(cors());
app.use(express.json({limit:MAX_JSON_SIZE}));
app.use(express.urlencoded({extended:URL_ENCODE}));
app.use(helmet());



// App use limiter
const limiter = rateLimit({windowMs: REQUEST_TIME, max: REQUEST_NUMBER});
app.use(limiter);


//Cache
app.set('etag', WEB_CACHE)



// Database connection
mongoose.connect(DATABASE_URL,{autoIndex:true}).then(()=>{
    console.log('MongoDB Connected');
}).catch(()=>{
    console.log('MongoDB Disconnected');
})


app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})