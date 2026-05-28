const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'millimart',
  user: 'postgres',
  password: '0404',
});

app.get('/api/products', async (_req, res) => {
  try {
    const result = await pool.query('select * from products order by name asc');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Products fetch failed', error: String(error) });
  }
});

app.get('/api/reviews', async (_req, res) => {
  try {
    const result = await pool.query('select * from reviews order by date desc');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Reviews fetch failed', error: String(error) });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { productId, userName, rating, pros, cons, comment, imageUrl } = req.body;
  try {
    const insert = await pool.query(
      `insert into reviews (product_id, user_name, rating, pros, cons, comment, image_url, status)
       values ($1,$2,$3,$4,$5,$6,$7,'pending') returning *`,
      [productId, userName, rating, pros ?? '', cons ?? '', comment, imageUrl ?? null],
    );
    res.status(201).json(insert.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Review create failed', error: String(error) });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
