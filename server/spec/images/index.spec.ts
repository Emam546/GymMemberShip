import agent from "..";

describe("get an image ", () => {
  test("success", async () => {
    await agent.get("/images/src/logo").expect(200);
  });
  test("get non-existed image", async () => {
    await agent.get("/images/src/non-existed").expect(404);
  });
});
