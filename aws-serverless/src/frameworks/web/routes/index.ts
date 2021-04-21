import express from "express";
import transactionRoutes from "./transactionRoutes";

const apiRouter = (dependencies: any) => {
  const routes = express.Router();

  const transactionRouter = transactionRoutes(dependencies);

  routes.use("/transactions", transactionRouter);

  return routes;
};

export default apiRouter;
