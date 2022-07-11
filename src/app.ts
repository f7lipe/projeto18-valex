import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routers/index.js";
import handleErrors from "./middlewares/errorHandlerMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(router)
app.use(handleErrors)



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
