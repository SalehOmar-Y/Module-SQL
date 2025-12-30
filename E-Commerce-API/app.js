const express = require("express");
const app = express();
app.use(express.json());// Middleware to parse JSON bodies

let customers = [     
        {
            id: 1,
            name: "Alice Smith",
            address: "456 Oak St",
            city: "Liverpool",
            country: "UK" 
        },
        {
            id: 2,
            name: "Lee Adam",
            address: "321 Sea St",
            city: "Birmingham",
            country: "UK"
        }
];

let orders = [{ id:1, customerId:1, orderItem:"Cups", quantity:4 },
             { id:2, customerId:1, orderItem:"Plates", quantity:2 }];

app.get("/products", (req, res) => {
  res.status(200).json([
    { name: "laptop",price: 2500, supplierName: "Dell" },
    { name: "phone",price: 800, supplierName: "Apple" },
    { name: "tablet",price: 600, supplierName: "Samsung" },
  ]); 
});

app.get("/customers/:id", (req, res) => {
    const custId = parseInt(req.params.id) // Simulate fetching from DB
    res.json({
        id: custId,
        name: "John Doe",
        address: "123 Main St",
        city: "Anytown",
        country: "USA"
    });
});

app.post("/customers", (req, res) => {
    const newCustomer = req.body;//
    newCustomer.id = 2; // Simulate DB generated ID
    res.status(201).json(newCustomer); // Return created customer
})

app.post("/products", (req, res) => {
    const newProduct = req.body;
    newProduct.id = 4;
    res.status(201).json(newProduct);
});

app.post("/product-availability", (req, res) => {
  const { productId, supplierId, price } = req.body;

  if (!Number.isInteger(price) || price <= 0) {
    return res.status(400).json({ error: "Price must be a positive integer" });
  } 

  const validSupplierIds = [1, 2, 3]; // Simulated existing supplier IDs
  if (!validSupplierIds.includes(supplierId)) {
    return res.status(404).json({ error: "Supplier not found" });
  }
  
  const validProductIds = [1, 2, 3]; // Simulated existing product IDs
  if (!validProductIds.includes(productId)) {
    return res.status(404).json({ error: "Product not found" });
  }
  const newAvailability = {
    id: 1, // Simulated DB generated ID
    productId,
    supplierId,
    price,
  };

  res.status(201).json(newAvailability);
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

  const customer = customers.find((customer) => customer.id === customerId);
  customer.name = name;
  customer.address = address;
  customer.city = city;
  customer.country = country;

  return res.status(200).json(customer);
});

app.delete("/orders/:orderId", (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const orderIndex = orders.findIndex(order => order.id === orderId);
    orders.splice(orderIndex, 1);
     return res.status(204).send();
});

app.delete("/customers/:customerId", (req, res) => {
    const customerId = parseInt(req.params.customerId);
    const hasOrders = orders.find(order => order.customerId === customerId);
    if (hasOrders) {
        return res.status(400).json({ error: "Cannot delete customer with existing orders" });
    }
    customers = customers.find(customer => customer.id !== customerId);
    return res.status(204).send();
});
module.exports = app;
