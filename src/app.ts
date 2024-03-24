import createError , { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import accountsRouter from "./routes/accounts.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/accounts", accountsRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
	next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
	// render the error page
	res.status(err.status || 500);
	res.send("server error: " + err.message);
});

export default app;
