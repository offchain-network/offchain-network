import Transaction, { ITransactionData } from "../entities/Transaction";

const request = require("supertest");
const app = require("../app");

const authHeader = "TEST";

describe("Listing Transactions", () => {
  it("can list all transactions", async () => {
    let response = await request(app)
      .get("/api/transactions")
      .set("Authorization", authHeader);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Transactions");
    expect(response.body.Transactions).toHaveLength(1);
  });

  it("will fail with no authorization header", async () => {
    let response = await request(app).get("/api/transactions");
    expect(response.status).toBe(401);
  });
});

describe("Creating Transactions", () => {
  const Tx: ITransactionData = {
    id: "2",
    SenderAddress: "0x2",
    ReceiverAddress: "0x3",
    AddressOfTokenUsed: "0xTokenAddress",
    AmountOfTokensWithSender: "100",
    AmountOfTokensWithReceiver: "100",
    TransactionNonce: 1,
    Signature: "JIBBERISH",
    ChannelId: "123",
  };

  it("can create a transaction", async () => {
    let response = await request(app)
      .post("/api/transactions")
      .set("Authorization", authHeader)
      .send({ Transaction: Tx });
    expect(response.status).toBe(200);

    let allTxs = await request(app)
      .get("/api/transactions")
      .set("Authorization", authHeader);
    expect(allTxs.status).toBe(200);
    expect(allTxs.body).toHaveProperty("Transactions");
    expect(allTxs.body.Transactions).toHaveLength(2);
  });

  it("sends status 400 when no Transaction in body", async () => {
    let response = await request(app)
      .post("/api/transactions")
      .set("Authorization", authHeader);
    expect(response.status).toBe(400);
  });
});

describe("Deleting Transactions", () => {
  it("can list all transactions", async () => {
    let response = await request(app)
      .delete("/api/transactions/1")
      .set("Authorization", authHeader);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Transaction deleted.");

    let allTxs = await request(app)
      .get("/api/transactions")
      .set("Authorization", authHeader);
    expect(allTxs.status).toBe(200);
    expect(allTxs.body).toHaveProperty("Transactions");
    expect(allTxs.body.Transactions).toHaveLength(1);
  });
});
