import IChannelRepository from "../../../application/contracts/IChannelRepository";
import AWS from "aws-sdk";

export default class DynamoDbChannelRepository implements IChannelRepository {
  public docClient: AWS.DynamoDB.DocumentClient;
  public tableName: string;

  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient({
      region: "eu-central-1",
    });
    const { CHANNEL_TABLE_NAME } = process.env;
    if (!CHANNEL_TABLE_NAME) throw new Error("No Table Name specified");
    this.tableName = CHANNEL_TABLE_NAME;
  }

  async create(props: any) {
    await this.docClient
      .put({ TableName: this.tableName, Item: props })
      .promise();
  }

  async delete(channelId: string) {
    await this.docClient
      .delete({ TableName: this.tableName, Key: { id: channelId } })
      .promise();
  }

  async list() {
    const { Items } = await this.docClient
      .scan({ TableName: this.tableName })
      .promise();
    return Items;
  }

  async get(channelId: string) {
    const { Item } = await this.docClient
      .get({ TableName: this.tableName, Key: { id: channelId } })
      .promise();
    return Item;
  }
}
