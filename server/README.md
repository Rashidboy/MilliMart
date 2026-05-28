## MilliMart Backend

- API root: `http://localhost:5000/api`
- DB: PostgreSQL (`millimart`)

### Start

1. Ensure PostgreSQL is running and database `millimart` exists.
2. Fill `server/.env` (already prefilled with requested values).
3. Run:

```bash
npm install
npm run server
```

On first start, tables are created automatically and products are seeded if empty.
