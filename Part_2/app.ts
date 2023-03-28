import express, { Application } from "express";
import bodyParser from "body-parser";
import {
  appendResponseTime,
  errorHandler,
  // jsonBodyParser,
} from "./src/middlewares";
import cors from "cors";

import { blogRouter } from "./src/routes";

const app: Application = express();

app.use(appendResponseTime);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(blogRouter);
app.use(errorHandler);

export default app;
