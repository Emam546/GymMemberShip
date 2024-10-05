import "@test/index";
import { expect } from "chai";
import { Document } from "mongoose";
import Admins from "@serv/models/admins";
import supertest, { SuperTest, Test } from "supertest";
import server from "@serv/server";

const agent = supertest(server);
describe("test auth", () => {
  let admins: Document<DataBase.Models.Admins>[];
  beforeAll(async () => {
    admins = await Admins.find({}).select("+password");
  });
  test("reauthenticate", async () => {
    console.log(admins);
    const admin = admins[0];
    const res = await agent
      .post("/api/admin/admins/auth/login")
      .send({
        id: admin._id,
        password: admin.toObject().password,
      })
      .expect(200);
    expect(res.body.data).not.undefined;
    expect(res.body.data.password).undefined;
    await agent
      .get("/api/admin/admins/auth/check")
      .set("Cookie", res.headers["set-cookie"])
      .expect(200);
  });
});

