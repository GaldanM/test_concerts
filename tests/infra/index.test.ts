import supertest from "supertest";

import server from "../../src/infra/server";

const request = supertest(server);

describe("search concerts routes", () => {
  it.each([
    ["by bands", { bandIds: [1] }],
    ["around a geopoint", { latitude: 43.63967479999999, longitude: -79.3535794, radius: 1 }],
    [
      "by bands AND around a geopoint",
      { bandIds: [1, 2], latitude: 43.63967479999999, longitude: -79.3535794, radius: 1 },
    ],
  ])("search concerts %s", async (name, parameters) => {
    const response = await request.get("/concerts").query(parameters);
    const [firstResult] = response.body;

    expect(response.statusCode).toStrictEqual(200);
    expect(firstResult).toHaveProperty("band");
    expect(firstResult).toHaveProperty("location");
    expect(firstResult).toHaveProperty("date");
    expect(firstResult).toHaveProperty("latitude");
    expect(firstResult).toHaveProperty("longitude");
  });
  it("should fail when searching concerts without parameters", async () => {
    const response = await request.get("/concerts");

    expect(response.statusCode).toStrictEqual(409);
  });
});
