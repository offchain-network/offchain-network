import express from "express";
import channelController from "../../../controllers/channelController";
import { IDependencies } from "../../../types/types";
import authMiddlewares from "../middlewares/authMiddlewares";

const channelRoutes = (dependencies: IDependencies) => {
  const router = express.Router();

  const { isAuthorized } = authMiddlewares(dependencies);

  const controller = channelController(dependencies);

  router
    .route("/")
    .all(isAuthorized)
    .get(controller.listChannels)
    .post(controller.createChannel)
    .delete(controller.deleteChannel);

  router
    .route("/:channelId")
    .all(isAuthorized)
    .get(controller.getChannel)
    .delete(controller.deleteChannel);

  return router;
};

export default channelRoutes;
