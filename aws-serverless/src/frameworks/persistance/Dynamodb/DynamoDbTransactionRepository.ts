import ITransactionRepository from "../../../application/contracts/ITransactionRepository";
import AWS from "aws-sdk";
import Transaction, { ITransactionData } from "../../../entities/Transaction";

export default class DynamoDbTransactionRepository
  implements ITransactionRepository {
  public docClient: AWS.DynamoDB.DocumentClient;
  public tableName: string;
  public senderGSI: string;
  public receiverGSI: string;
  public channelGSI: string;

  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient({
      region: "eu-central-1",
    });
    const {
      MAIN_TABLE_NAME,
      SENDER_GSI,
      RECEIVER_GSI,
      CHANNEL_GSI,
    } = process.env;
    if (!MAIN_TABLE_NAME || !SENDER_GSI || !RECEIVER_GSI || !CHANNEL_GSI)
      throw new Error("No Table Name specified");
    this.tableName = MAIN_TABLE_NAME;
    this.senderGSI = SENDER_GSI;
    this.receiverGSI = RECEIVER_GSI;
    this.channelGSI = CHANNEL_GSI;
  }

  async create(transaction: ITransactionData) {
    await this.docClient
      .put({ Item: transaction, TableName: this.tableName })
      .promise();
  }

  async delete(transactionId: string) {
    await this.docClient
      .delete({ Key: { id: transactionId }, TableName: this.tableName })
      .promise();
  }

  async listBySender(senderId: string) {
    const { Items = [] }: any = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: this.senderGSI,
        FilterExpression: `#SenderAddress = :SenderAddress}`,
        ExpressionAttributeNames: {
          "#SenderAddress": "SenderAddress",
        },
        ExpressionAttributeValues: {
          ":SenderAddress": senderId,
        },
      })
      .promise();

    if (!Items || Items.length === 0) return [];

    const txs = Items.map((tx: ITransactionData) => {
      return new Transaction(tx, tx.id);
    });

    return txs;
  }

  async listByReceiver(receiverId: string) {
    const { Items = [] }: any = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: this.receiverGSI,
        FilterExpression: `#ReceiverAddress = :ReceiverAddress}`,
        ExpressionAttributeNames: {
          "#ReceiverAddress": "ReceiverAddress",
        },
        ExpressionAttributeValues: {
          ":ReceiverAddress": receiverId,
        },
      })
      .promise();

    if (!Items || Items.length === 0) return [];

    const txs = Items.map((tx: ITransactionData) => {
      return new Transaction(tx, tx.id);
    });

    return txs;
  }

  async listByChannelId(channelId: string) {
    const { Items = [] }: any = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: this.channelGSI,
        FilterExpression: `#ChannelId = :ChannelId}`,
        ExpressionAttributeNames: {
          "#ChannelId": "ChannelId",
        },
        ExpressionAttributeValues: {
          ":ChannelId": channelId,
        },
      })
      .promise();

    if (!Items || Items.length === 0) return [];

    const txs = Items.map((tx: ITransactionData) => {
      return new Transaction(tx, tx.id);
    });

    return txs;
  }

  async list() {
    const { Items = [] }: any = await this.docClient
      .scan({ TableName: this.tableName })
      .promise();
    if (!Items || Items.length === 0) return [];

    const txs = Items.map((tx: ITransactionData) => {
      return new Transaction(tx, tx.id);
    });

    return txs;
  }
}
