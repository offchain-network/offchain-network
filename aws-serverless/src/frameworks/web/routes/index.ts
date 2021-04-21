import express from "express";
import { IDependencies } from "../../../types/types";
import transactionRoutes from "./transactionRoutes";

const apiRouter = (dependencies: IDependencies) => {
  const routes = express.Router();

  const transactionRouter = transactionRoutes(dependencies);

  routes.use("/transactions", transactionRouter);

  return routes;
};

export default apiRouter;
