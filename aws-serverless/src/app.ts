import express from "express";
import bodyParser from "body-parser";
import ErrorHandler from "./frameworks/common/ErrorHandler";
import * as dotenv from "dotenv";
import cors from "cors";
import dependencies from "./config/dependencies";
import routes from "./frameworks/web/routes";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use("/api", routes(dependencies()));

app.use(ErrorHandler);

module.exports = app;
