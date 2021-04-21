import ITransactionRepository from "../../../application/contracts/ITransactionRepository";
import Transaction, { ITransactionData } from "../../../entities/Transaction";

export class InMemoryTransactionRepository implements ITransactionRepository {
  transactions: ITransactionData[] = [
    {
      id: "1",
      SenderAddress: "0x1",
      ReceiverAddress: "0x2",
      AddressOfTokenUsed: "0x111",
      AmountOfTokensWithSender: "10000",
      AmountOfTokensWithReceiver: "10000",
      TransactionNonce: 1,
      Signature: "0x0001",
      ChannelId: "12345",
    },
  ];

  async get(transactionId: string) {
    const foundTx = this.transactions.find((tx) => tx.id === transactionId);
    if (!foundTx) throw new Error("No Transaction found");
    const tx = new Transaction(foundTx, foundTx.id);
    return tx;
  }

  async create(transaction: ITransactionData) {
    this.transactions.push(transaction);
  }

  async delete(transactionId: string) {
    this.transactions = this.transactions.filter(
      (tx) => tx.id !== transactionId
    );
  }

  async listBySender(senderId: string) {
    const search = this.transactions.filter(
      (tx) => tx.SenderAddress === senderId
    );
    const txs = search.map((tx) => {
      return new Transaction(tx, tx.id);
    });
    return txs;
  }

  async listByReceiver(receiverId: string) {
    const search = this.transactions.filter(
      (tx) => tx.ReceiverAddress === receiverId
    );
    const txs = search.map((tx) => {
      return new Transaction(tx, tx.id);
    });
    return txs;
  }

  async listByChannelId(channelId: string) {
    const search = this.transactions.filter((tx) => tx.ChannelId === channelId);
    const txs = search.map((tx) => {
      return new Transaction(tx, tx.id);
    });
    return txs;
  }

  async list() {
    const txs = this.transactions.map((tx) => {
      return new Transaction(tx, tx.id);
    });
    return txs;
  }
}
