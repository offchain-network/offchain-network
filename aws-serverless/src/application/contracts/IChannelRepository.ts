export default interface IChannelRepository {
  create(): Promise<void>;
  delete(): Promise<void>;
  list(): Promise<any>;
}
