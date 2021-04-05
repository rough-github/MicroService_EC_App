import express from "express";
import "express-async-errors";
import {json} from "body-parser";
import cookieSession from "cookie-session";
import {NotFoundError, errorHandler, currentUser} from "@roughtickets/common";

import {newOrderRouter} from "./routes/new";
import {showOrderRouter} from "./routes/show";
import {indexOrderRouter} from "./routes/index";
import {deleteOrderRouter} from "./routes/delete";


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  // switching process.env.NODE_ENV
  secure: process.env.NODE_ENV !== "test"
}))
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

// async error handling
app.all('*', async (req, res, next) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export default app;