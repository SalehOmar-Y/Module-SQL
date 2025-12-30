const request = require("supertest");
const app = require("../app");

describe("DELETE /orders/:orderId", () => {
    it("should delete an order by its id", async () => {
        const response = await request(app).delete("/orders/1");
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
    });

});