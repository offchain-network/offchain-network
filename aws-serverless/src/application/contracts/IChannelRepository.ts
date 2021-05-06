export default interface IChannelRepository {
  create(props: any): Promise<void>;
  delete(channelId: string): Promise<void>;
  list(): Promise<any>;
  get(channelId: string): Promise<any>;
}
