import { RequestHandler } from "express";
import { IDependencies } from "../types/types";

const channelController = (dependencies: IDependencies) => {
  const { ChannelRepository } = dependencies;

  const createChannel: RequestHandler = async (req, res, next) => {
    const { channel } = req.body;
    const { id, recipient, amount } = channel;

    if (!channel) {
      return res.status(400).json({ message: "Channel required" });
    }

    if (!id || !recipient || !amount) {
      return res
        .status(400)
        .json({ message: "Id, Recipient and amount needed on channel" });
    }

    await ChannelRepository.create(channel);
    res.status(200).json({ message: "Channel created." });
  };

  const deleteChannel: RequestHandler = async (req, res, next) => {
    const { channelId } = req.params;

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

  const getChannel: RequestHandler = async (req, res, next) => {
    const { channelId } = req.params;
    if (!channelId) {
      return res.status(400).json({ message: "ChannelId required" });
    }
    const channel = await ChannelRepository.get(channelId);

    res.status(200).json({ channel });
  };

  return {
    createChannel,
    deleteChannel,
    listChannels,
    getChannel,
  };
};

export default channelController;
