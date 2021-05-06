import IChannelRepository from "../../../application/contracts/IChannelRepository";

export default class DynamoDbChannelRepository implements IChannelRepository {
  channels: any = [
    { id: "123", recipient: "0x0", amount: "100" },
    { id: "456", recipient: "0x1", amount: "200" },
  ];

  async create(props: any) {
    this.channels.push(props);
  }

  async delete(channelId: string) {
    this.channels = this.channels.filter((c: any) => c.id !== channelId);
  }

  async list() {
    return this.channels;
  }
}
