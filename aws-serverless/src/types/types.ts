import IChannelRepository from "../application/contracts/IChannelRepository";
import ITransactionRepository from "../application/contracts/ITransactionRepository";

export type IDependencies = {
  TransactionRepository: ITransactionRepository;
  ChannelRepository: IChannelRepository;
};
