const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");
require("dotenv").config();
const { metricsMiddleware, setupMetrics } = require('./metrics');

const app = express();
app.use(express.json());

setupMetrics(app, { serviceName: 'order-service', serviceVersion: '1.0.0' });

app.use(metricsMiddleware);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS order_service;

    CREATE TABLE IF NOT EXISTS order_service.orders(
      id SERIAL PRIMARY KEY,
      product_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

app.post("/orders", async (req, res) => {
  const { productId } = req.body;

  const productRes = await axios.get(
    `${process.env.PRODUCT_SERVICE_URL}/products`
  );

  const product = productRes.data.find(p => p.id === productId);

  if (!product)
    return res.status(404).json({ error: "Product not found" });

  const { rows } = await pool.query(
    `INSERT INTO order_service.orders(product_id)
     VALUES($1) RETURNING *`,
    [productId]
  );

  res.json({
    order: rows[0],
    product
  });
});

app.post("/checkout", async (req, res) => {
  try {
    console.log("=========================================");
    console.log("📧 MOCK EMAIL SENT TO USER:");
    console.log("Subject: Order Confirmation");
    console.log("Message: lolnis a fack e commers pese nhi kateee");
    console.log("=========================================");
    
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ success: true, message: 'Payment processed and email sent successfully!' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, error: 'Failed to process checkout' });
  }
});

app.listen(process.env.PORT, async () => {
  await init();
  console.log("Order Service running");
});

