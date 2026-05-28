const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
// Muhim: fayl kengaytmasini .cjs deb ko'rsatamiz
const { PRODUCT_SEEDS } = require('./productSeeds.cjs');

// .env faylini server papkasi ichidan qidirish
dotenv.config({ path: `${__dirname}/.env` });

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'millimart',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '0404',
});

// Reytingni qayta hisoblash funksiyasi
async function recalcProductRating(productId) {
  await pool.query(
    `
      update products p
      set
        rating_avg = coalesce(s.avg_rating, 0),
        review_count = coalesce(s.review_count, 0)
      from (
        select product_id, round(avg(rating)::numeric, 2) as avg_rating, count(*)::int as review_count
        from reviews
        where status = 'approved'
        group by product_id
      ) s
      where p.id = $1 and p.id = s.product_id
    `,
    [productId],
  );
  await pool.query(
    `
      update products
      set rating_avg = 0, review_count = 0
      where id = $1
        and not exists (select 1 from reviews where product_id = $1 and status = 'approved')
    `,
    [productId],
  );
}

// Bazani ishga tushirish va jadvallarni yaratish
async function initDb() {
  // 1. Mahsulotlar jadvali
  await pool.query(`
    create table if not exists products (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      description text not null,
      price bigint not null,
      discount integer not null default 0,
      images text[] not null default '{}',
      category text not null,
      rating_avg numeric(3,2) not null default 0,
      review_count integer not null default 0,
      stock integer not null default 0,
      created_at timestamptz not null default now()
    );
  `);

  // 2. Sharhlar jadvali
  await pool.query(`
    create table if not exists reviews (
      id uuid primary key default gen_random_uuid(),
      product_id uuid not null references products(id) on delete cascade,
      user_name text not null,
      rating integer not null check (rating between 1 and 5),
      pros text,
      cons text,
      comment text not null,
      image_url text,
      date date not null default now(),
      status text not null default 'pending' check (status in ('pending', 'approved')),
      created_at timestamptz not null default now()
    );
  `);

  // 3. Savatcha jadvali
  await pool.query(`
    create table if not exists cart_items (
      id uuid primary key default gen_random_uuid(),
      user_id text not null,
      product_id uuid not null references products(id) on delete cascade,
      quantity integer not null default 1 check (quantity > 0),
      created_at timestamptz not null default now(),
      unique (user_id, product_id)
    );
  `);

  // 4. Agar baza bo'sh bo'lsa, ma'lumotlar bilan to'ldirish
  const countRes = await pool.query('select count(*)::int as count from products');
  if (countRes.rows[0].count === 0) {
    console.log(`Seed ma'lumotlari yuklanmoqda...`);
    for (const p of PRODUCT_SEEDS) {
      await pool.query(
        `insert into products (name, description, price, discount, images, category, stock, rating_avg, review_count)
         values ($1,$2,$3,$4,$5,$6,$7,0,0)`,
        [p.name, p.description, p.price, p.discount, p.images, p.category, p.stock],
      );
    }
  }
}

// API Yo'nalishlari (Endpoints)
app.get('/api/products', async (_req, res) => {
  try {
    const data = await pool.query('select * from products order by name asc');
    res.json(data.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, description, price, discount, images, category, stock } = req.body;
  const data = await pool.query(
    `insert into products (name, description, price, discount, images, category, stock, rating_avg, review_count)
     values ($1,$2,$3,$4,$5,$6,$7,0,0) returning *`,
    [name, description, price, discount ?? 0, images ?? [], category, stock ?? 0],
  );
  res.status(201).json(data.rows[0]);
});

app.patch('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount, images, category, stock } = req.body;
  const data = await pool.query(
    `update products
     set name = $1, description = $2, price = $3, discount = $4, images = $5, category = $6, stock = $7
     where id = $8 returning *`,
    [name, description, price, discount ?? 0, images ?? [], category, stock ?? 0, id],
  );
  res.json(data.rows[0]);
});

app.delete('/api/products/:id', async (req, res) => {
  await pool.query('delete from products where id = $1', [req.params.id]);
  res.json({ ok: true });
});

app.get('/api/reviews', async (_req, res) => {
  try {
    const data = await pool.query('select * from reviews order by date desc');
    res.json(data.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { productId, userName, rating, pros, cons, comment, imageUrl } = req.body;
  const data = await pool.query(
    `insert into reviews (product_id, user_name, rating, pros, cons, comment, image_url, status)
     values ($1,$2,$3,$4,$5,$6,$7,'pending') returning *`,
    [productId, userName, rating, pros ?? '', cons ?? '', comment, imageUrl ?? null],
  );
  await recalcProductRating(productId);
  res.status(201).json(data.rows[0]);
});

app.patch('/api/reviews/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await pool.query('update reviews set status = $1 where id = $2 returning *', [status, id]);
    if (!updated.rows[0]) {
      return res.status(404).json({ error: 'Review topilmadi' });
    }
    await recalcProductRating(updated.rows[0].product_id);
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const found = await pool.query('select product_id from reviews where id = $1', [req.params.id]);
    await pool.query('delete from reviews where id = $1', [req.params.id]);
    if (found.rows[0]) await recalcProductRating(found.rows[0].product_id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  const data = await pool.query('select * from cart_items where user_id = $1', [req.params.userId]);
  res.json(data.rows);
});

app.post('/api/cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const data = await pool.query(
    `insert into cart_items (user_id, product_id, quantity)
     values ($1,$2,$3)
     on conflict (user_id, product_id)
     do update set quantity = excluded.quantity
     returning *`,
    [userId, productId, quantity],
  );
  res.status(201).json(data.rows[0]);
});

app.delete('/api/cart/:id', async (req, res) => {
  await pool.query('delete from cart_items where id = $1', [req.params.id]);
  res.json({ ok: true });
});

app.delete('/api/cart/user/:userId', async (req, res) => {
  await pool.query('delete from cart_items where user_id = $1', [req.params.userId]);
  res.json({ ok: true });
});

// Serverni ishga tushirish
const PORT = Number(process.env.PORT || 5000);
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MilliMart API running: http://localhost:${PORT}`);
      console.log(`PostgreSQL bazasiga muvaffaqiyatli ulanildi.`);
    });
  })
  .catch((error) => {
    console.error('Baza bilan xatolik:', error);
    process.exit(1);
  });