const request = require("supertest");
const app = require("../app");

describe("DELETE /orders/:orderId", () => {
    it("should delete an order by its id", async () => {
        const response = await request(app).delete("/orders/1");
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
    });

});

describe("Get /orders/:customerId", () => {
    it("should return all orders for a specific customer", async () => {
        const response = await request(app).get("/customers/1/orders");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    orderDate: expect.any(String),
                    referenceNumber: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            productName: expect.any(String),
                            unitPrice: expect.any(Number),
                            supplierName: expect.any(String),
                            quantity: expect.any(Number),
                        }),
                    ]),
                }),
            ])
        );
    });
}); 