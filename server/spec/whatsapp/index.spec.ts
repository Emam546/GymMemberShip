import whatsappClient, { connectWhatsapp } from "@serv/whatsapp";
import { expect } from "chai";
import agent from "..";
import fs from "fs";
import path from "path";
import mime from "mime-types";
const timeout = 10000;
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
  test("send an image", async () => {
    const res = await agent
      .post("/api/admin/whatsapp")
      .field(
        "data",
        JSON.stringify({
          number: number,
          messages: [
            {
              file: 0,
            },
          ],
        })
      )
      .attach("0", path.join(__dirname, "./sample.jpg"))
      .expect(200);
  });
  test("send a video", async () => {
    const video = fs.readFileSync(path.join(__dirname, "./video.mp4"));
    const res = await agent
      .post("/api/admin/whatsapp")
      .field(
        "data",
        JSON.stringify({
          number: number,
          messages: [
            {
              file: 0,
            },
          ],
        })
      )
      .attach("0", video)
      .expect(200);
  });
});
