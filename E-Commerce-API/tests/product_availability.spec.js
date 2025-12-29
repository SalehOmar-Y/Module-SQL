const request = require("supertest");
const app = require("../app");

describe("POST /product-availability", () => {
  it("creates a new availability record", async () => {
    const payload = {
      productId: 1,
      supplierId: 1,
      price: 1500,
    };

    const response = await request(app)
      .post("/product-availability")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        productId: 1,
        supplierId: 1,
        price: 1500,
      })
    );
  });

  it("returns 400 if price is not a positive integer", async () => {
    const payload = {
      productId: 1,
      supplierId: 1,
      price: -500,
    };

    const response = await request(app)
      .post("/product-availability")
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("returns 404 if supplierId does not exist", async () => {
    const payload = {
      productId: 1,
      supplierId: 909,
      price: 500,
    };

    const response = await request(app)
      .post("/product-availability")
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("returns 404 if productId does not exist", async () => {
    const payload = {
      productId: 999,
      supplierId: 1,
      price: 500,
    };

    const response = await request(app)
      .post("/product-availability")
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});
