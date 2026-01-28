require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());// Middleware to parse JSON bodies

const pool = require("./db");
app.get("/products", (req, res) => {
  try {
    pool.query("SELECT * FROM products", (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/customers/:id",(req, res) => {
  const customerId = parseInt(req.params.id);

    pool.query("SELECT * FROM customers WHERE id = $1", [customerId], (error, result) => {
        if (error) {
         console.error("Error fetching customer:", error.message);
         return res.status(500).json({ error: "Database error", details: error.message });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json(result.rows[0]);
  });

});

app.get("/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY id ASC");
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching customers:", err.message);
    return res.status(500).json({ error: "Database error", detail: err.message });
  }
});


app.post("/customers", async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO customers (name, address, city, country)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, address, city, country]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/products", async (req, res) => {
    const {name, price, supplierId } = req.body;
    
    if (!name || !price || !supplierId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try { 
      const result = await pool.query(
        `INSERT INTO products (product_name, unit_price, supplier_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, price, supplierId]
      );

      return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/product-availability", async (req, res) => {
  const { productId, supplierId, price } = req.body;

  if (!Number.isInteger(productId) || !Number.isInteger(supplierId) || !Number.isInteger(price) || price <= 0) {
    return res.status(400).json({ error: "Invalid availability data" });
  } 

  try {
    const result = await pool.query(
      `INSERT INTO product_availability (prod_id, supp_id, unit_price)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [productId, supplierId, price]
    );

    return res.status(201).json(result.rows[0]);
  }
  catch (err) {
    console.error("Error creating product availability:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/customers/:customerId/orders", (req, res) => {
    const customerId = parseInt(req.params.customerId);
    const newOrder = req.body;
    newOrder.id = 1;
    newOrder.customerId = customerId;

     if (customerId !== 1) {
        return res.status(404).json({ error: "Customer not found" });
    }
    res.status(201).json(newOrder);
});

app.put("/customers/:customerId", (req, res) => {
  const customerId = Number(req.params.customerId);
  const { name, address, city, country } = req.body;

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }

  try{
    const result = pool.query(
      `UPDATE customers
        SET name = $1, address = $2, city = $3, country = $4
        WHERE id = $5
        RETURNING *`,
      [name, address, city, country, customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating customer:", err.message);
    return res.status(500).json({ error: "Database error", detail: err.message });
  }
});

app.delete("/orders/:orderId", async (req, res) => {
  const orderId = Number(req.params.orderId);

  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING id",
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Database error", detail: err.message });
  }
});


app.delete("/customers/:customerId", async (req, res) => {
  const customerId = Number(req.params.customerId);

  try {
    const hasOrders = await pool.query(
      "SELECT 1 FROM orders WHERE customer_id = $1 LIMIT 1",
      [customerId]
    );

    if (hasOrders.rows.length > 0) {
      return res.status(400).json({ error: "Cannot delete customer with existing orders" });
    }

    const deleted = await pool.query(
      "DELETE FROM customers WHERE id = $1 RETURNING id",
      [customerId]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Database error", detail: err.message });
  }
});


app.get("/customers/:customerId/orders", async (req, res) => {
  const customerId = Number(req.params.customerId);

  try {
    const ordersResult = await pool.query(
      `SELECT id, order_date, order_reference
       FROM orders
       WHERE customer_id = $1
       ORDER BY order_date DESC, id DESC`,
      [customerId]
    );

    const orderIds = ordersResult.rows.map(o => o.id);

    if (orderIds.length === 0) {
      return res.status(200).json([]);
    }

    const itemsResult = await pool.query(
      `SELECT oi.order_id, oi.product_id, oi.quantity, oi.unit_price
       FROM order_items oi
       WHERE oi.order_id = ANY($1::int[])`,
      [orderIds]
    );

    const itemsByOrder = new Map();
    for (const item of itemsResult.rows) {
      const arr = itemsByOrder.get(item.order_id) || [];
      arr.push(item);
      itemsByOrder.set(item.order_id, arr);
    }

    const response = ordersResult.rows.map(o => ({
      id: o.id,
      orderDate: o.order_date,
      referenceNumber: o.order_reference,
      items: itemsByOrder.get(o.id) || []
    }));

    return res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Database error", detail: err.message });
  }
});



module.exports = app;
