import whatsappClient, { connectWhatsapp } from "@serv/whatsapp";
import { expect } from "chai";
import agent from "..";
import fs from "fs";
import path from "path";
import mime from "mime-types";
const timeout = 1000000;
jest.setTimeout(timeout);
beforeAll(async () => {
  const res = await connectWhatsapp(timeout - 1000);
  expect(res).true;
});
const number = "201080741858";
const image = fs.readFileSync(path.join(__dirname, "./sample.jpg"));
describe("send a file", () => {
  test("send successfully", async () => {
    await agent
      .post("/api/admin/whatsapp")
      .field(
        "data",
        JSON.stringify({
          number: number,
          messages: [
            {
              message: "Hello World",
            },
          ],
        })
      )
      .expect(200);
  });
  test("send a file", async () => {
    const res = await agent
      .post("/api/admin/whatsapp")
      .field(
        "data",
        JSON.stringify({
          number: number,
          messages: [
            {
              data: image.toString("base64"),
              type: mime.contentType("sample.jpg"),
            },
          ],
        })
      )
      .expect(200);
  });
  test("send two files after each time", async () => {
    const res = await agent
      .post("/api/admin/whatsapp")
      .field(
        "data",
        JSON.stringify({
          number: number,
          messages: [
            {
              data: image.toString("base64"),
              type: mime.contentType("sample.jpg"),
            },
            {
              data: image.toString("base64"),
              type: mime.contentType("sample.jpg"),
            },
            {
              data: image.toString("base64"),
              type: mime.contentType("sample.jpg"),
            },
          ],
        })
      )
      .expect(200);
  });
  test("send two requests to test regex", async () => {
    await agent
      .post("/api/admin/whatsapp")
      .field(
        "data",
        JSON.stringify({
          number: number,
          messages: [
            {
              message: "Hello World",
            },
          ],
        })
      )
      .expect(200);
    await agent
      .post("/api/admin/whatsapp")
      .field(
        "data",
        JSON.stringify({
          number: number,
          messages: [
            {
              message: "Hello World",
            },
          ],
        })
      )
      .expect(200);
  });
});
