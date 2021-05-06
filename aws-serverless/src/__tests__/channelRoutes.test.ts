import AWS from "aws-sdk";

const request = require("supertest");
const app = require("../app");

const authHeader = "TEST";

describe("channel routes", () => {
  it("Can list", async () => {
    let response = await request(app)
      .get("/api/channels")
      .set("Authorization", authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("channels");
    expect(response.body.channels).toHaveLength(2);
  });

  it("Can get", async () => {
    let response = await request(app)
      .get("/api/channels/123")
      .set("Authorization", authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("channel");
    expect(response.body.channel).toHaveProperty("id", "123");
  });

  it("Can post", async () => {
    let response = await request(app)
      .post("/api/channels")
      .set("Authorization", authHeader)
      .send({ channel: { id: "789", receiver: "0x2", amount: "20" } });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");

    let newResponse = await request(app)
      .get("/api/channels")
      .set("Authorization", authHeader);

    expect(newResponse.status).toBe(200);
    expect(newResponse.body).toHaveProperty("channels");
    expect(newResponse.body.channels).toHaveLength(3);
  });

  it("Can delete", async () => {
    let response = await request(app)
      .delete("/api/channels/123")
      .set("Authorization", authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");

    let newResponse = await request(app)
      .get("/api/channels")
      .set("Authorization", authHeader);

    expect(newResponse.status).toBe(200);
    expect(newResponse.body).toHaveProperty("channels");
    expect(newResponse.body.channels).toHaveLength(2);
  });
});
