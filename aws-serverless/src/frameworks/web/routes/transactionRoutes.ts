import express from "express";
import transactionController from "../../../controllers/transactionController";
import { IDependencies } from "../../../types/types";
import authMiddlewares from "../middlewares/authMiddlewares";

const transactionRoutes = (dependencies: IDependencies) => {
  const router = express.Router();

  const { isAuthorized } = authMiddlewares(dependencies);

  const controller = transactionController(dependencies);

  router
    .route("/")
    .all(isAuthorized)
    .get(controller.listTransactions)
    .post(controller.createTransaction);

  router
    .route("/:transactionId")
    .all(isAuthorized)
    .delete(controller.deleteTransaction);

  return router;
};

export default transactionRoutes;
