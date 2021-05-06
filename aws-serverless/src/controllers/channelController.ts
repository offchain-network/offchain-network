import { RequestHandler } from "express";
import { IDependencies } from "../types/types";

const channelController = (dependencies: IDependencies) => {
  const { ChannelRepository } = dependencies;

  const createChannel: RequestHandler = async (req, res, next) => {
    const { channel } = req.body;

    if (!channel) {
      return res.status(400).json({ message: "Channel required" });
    }

    await ChannelRepository.create(channel);
    res.status(200).json({ message: "Channel created." });
  };

  const deleteChannel: RequestHandler = async (req, res, next) => {
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({ message: "ChannelId required" });
    }

    await ChannelRepository.delete(channelId);
    res.status(200).json({ message: "Channel deleted." });
  };

  const listChannels: RequestHandler = async (req, res, next) => {
    const channels = await ChannelRepository.list();
    res.status(200).json({ channels });
  };

  return {
    createChannel,
    deleteChannel,
    listChannels,
  };
};

export default channelController;
