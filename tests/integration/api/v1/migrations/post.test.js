import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response1Post = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response1Post.status).toBe(201);

        const response1Body = await response1Post.json();
        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const response2Post = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2Post.status).toBe(200);

        const response2Body = await response2Post.json();
        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
