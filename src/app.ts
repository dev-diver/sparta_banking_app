import createError , { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { setupAccountRoutes } from "./routes/accounts";
import { Result } from "@interfaces/RepositoryDTO/Result";

declare module 'express-serve-static-core' {
  interface Request {
    result?: Result<any>;
  }
}

export const createApp = () =>{
	const app = express();

	app.use(logger("dev"));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());

	const resultHandler = (req: Request, res: Response, next: NextFunction) => {
		let result = req.result;
		if(result?.success){
			res.json(result)
		}else{
			next(createError(400, result?.error || '알 수 없는 에러'))
		}
	}

	app.use("/accounts", setupAccountRoutes(), resultHandler);

	app.use((req: Request, res: Response, next: NextFunction) => {
		next(createError(404));
	});

	// error handler
	app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
		// render the error page
		res.status(err.status || 500);
		res.send({
			success : false,
			error : err.message}
		);
	});

	return app;
}

