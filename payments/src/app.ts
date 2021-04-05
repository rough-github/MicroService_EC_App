import express from "express";
import "express-async-errors";
import {json} from "body-parser";
import cookieSession from "cookie-session";
import {NotFoundError, errorHandler, currentUser} from "@roughtickets/common";

import { createChargeRouter } from "./routes/new";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  // switching process.env.NODE_ENV
  secure: process.env.NODE_ENV !== "test"
}))
app.use(currentUser);

// Router
app.use(createChargeRouter);

// async error handling
app.all('*', async (req, res, next) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export default app;