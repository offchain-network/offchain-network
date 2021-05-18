import express from "express";
import { IDependencies } from "../../../types/types";
import channelRoutes from "./channelRoutes";
import transactionRoutes from "./transactionRoutes";

const apiRouter = (dependencies: IDependencies) => {
  const routes = express.Router();

  const transactionRouter = transactionRoutes(dependencies);
  const channelRouter = channelRoutes(dependencies);

  routes.use("/transactions", transactionRouter);
  routes.use("/channels", channelRouter);

  return routes;
};

export default apiRouter;
