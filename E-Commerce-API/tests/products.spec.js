const request = require("supertest");
const app = require("../app");

describe("GET /products", () => {
  it("should return a list of all product names with their prices and supplier names", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          price: expect.any(Number),
          supplierName: expect.any(String),
        }),
      ])
    );
  });
});

describe("GET /products?name=", () => {
  it("filters products by name", async () => {
    const response = await request(app).get("/products?name=lap");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          price: expect.any(Number),
          supplierName: expect.any(String),
        }),
      ])
    );
  });
});

describe("Post /products", () => {
  it("should create a new product", async () => {
    const newProduct = {
      name: "Smartwatch",
      price: 300,
      supplierName: "SaFit",
    };
    const response = await request(app)
      .post("/products")
      .send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: "Smartwatch",
        price: 300,
        supplierName: "SaFit",
      })
    );
  });
})
