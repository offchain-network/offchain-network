import Transaction, { ITransactionData } from "../../entities/Transaction";

export default interface ITransactionRepository {
  create(transaction: ITransactionData): Promise<void>;
  delete(transaction: ITransactionData): Promise<void>;
  listBySender(senderId: string): Promise<Transaction[]>;
  listByReceiver(receiverId: string): Promise<Transaction[]>;
  list(): Promise<Transaction[]>;
}
