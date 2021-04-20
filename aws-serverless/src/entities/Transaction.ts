import { Entity } from "./Entity";

export type ITransactionData = {
  id: string;
  SenderAddress: string;
  ReceiverAddress: string;
  AddressOfTokenUsed: string;
  AmountOfTokensWithSender: string;
  AmountOfTokensWithReceiver: string;
  TransactionNonce: number;
  Signature: any;
};

export default class Transaction extends Entity<ITransactionData> {
  private constructor(props: ITransactionData, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get SenderAddress(): string {
    return this.SenderAddress;
  }

  get ReceiverAddress(): string {
    return this.ReceiverAddress;
  }

  get AddressOfTokenUsed(): string {
    return this.AddressOfTokenUsed;
  }

  get AmountOfTokensWithSender(): string {
    return this.AmountOfTokensWithSender;
  }

  get AmountOfTokensWithReceiver(): string {
    return this.AmountOfTokensWithReceiver;
  }

  get TransactionNonce(): number {
    return this.TransactionNonce;
  }

  get Signature(): any {
    return this.Signature;
  }
}
