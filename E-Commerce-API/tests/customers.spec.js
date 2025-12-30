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

describe("Post /customers", () => {
    it("should create a new customer", async () => {
        const newCustomer = {
            name: "Alice Smith",
            address: "456 Oak St",
            city: "Liverpool",
            country: "UK"};
        const response = await request(app)
            .post("/customers")
            .send(newCustomer);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: "Alice Smith",
                address: "456 Oak St",
                city: "Liverpool",
                country: "UK"
            })
        );
    });
});

describe("Post /customers/:customerId/orders", () => {
    it("should create a new order for a customer", async () => {
        const newOrder = {
            orderDate: "2025-12-30",
            referenceNumber: "ORD123",
        };
        const response = await request(app)
            .post("/customers/1/orders")
            .send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                customerId: 1,
                orderDate: "2025-12-30",
                referenceNumber: "ORD123",
            })
        );
    });
    it("should return 404 if customer does not exist", async () => {
        const newOrder = {
            orderDate: "2025-12-30",
            referenceNumber: "ORD123",
        };
        const response = await request(app)
            .post("/customers/999/orders")
            .send(newOrder);
        expect(response.status).toBe(404);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});
