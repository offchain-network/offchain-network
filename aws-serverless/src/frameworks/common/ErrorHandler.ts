import { ErrorRequestHandler } from "express";

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.message);

  if (!err.statusCode) err.statusCode = 500;

  res
    .status(err.statusCode)
    .json({ status: "error", message: err.message })
    .end();
};

export default ErrorHandler;
