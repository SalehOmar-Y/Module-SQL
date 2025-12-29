const request = require("supertest");
const app = require("../app");


describe("Get /customers/:id", () => {
  it("should return a single costumer by its id", async () => {
    const response = await request(app).get("/customers/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        address: expect.any(String),
        city: expect.any(String),
        country: expect.any(String),
      }       
      )
    )
  })
})