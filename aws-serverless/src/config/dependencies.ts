import DynamoDbChannelRepository from "../frameworks/persistance/Dynamodb/DynamoDbChannelRepository";
import DynamoDbTransactionRepository from "../frameworks/persistance/Dynamodb/DynamoDbTransactionRepository";
import { InMemoryTransactionRepository } from "../frameworks/persistance/InMemory/InMemoryTransactionRepository";
import InMemoryChannelRepository from "../frameworks/persistance/InMemory/InMemoryChannelRepository";

const dependencies = () => {
  let projectDependencies = {
    TransactionRepository:
      process.env.NODE_ENV === "test"
        ? new InMemoryTransactionRepository()
        : new DynamoDbTransactionRepository(),
    ChannelRepository:
      process.env.NODE_ENV === "test"
        ? new InMemoryChannelRepository()
        : new DynamoDbChannelRepository(),
  };

  return projectDependencies;
};

export default dependencies;
