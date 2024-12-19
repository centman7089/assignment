import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from 'cookie-parser'
 import path from "path"
import { connectDB } from './db/connectDB.js'
import authRoutes from "./routes/authRoute.js"
dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

 const __dirname = path.resolve();

app.use( cors( { origin: "http://localhost:5173", credentials: true } ) );


//middleware 
app.use( express.json() ) //allows us to parse incoming requests: req.body
app.use(express.urlencoded({ extended: true }));
app.use( cookieParser() ) //allows to parse incoming cookies

app.get( "/", ( req, res ) =>
{
    res.send("welcome, its nice having you here")
})

app.use("/api/auth", authRoutes)
//to build the appication
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
}

app.listen(PORT, () => {
    connectDB()
    console.log("server is running on port: ",PORT);
    
})