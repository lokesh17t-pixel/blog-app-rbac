# Unit 3 — MongoDB Aggregation Pipeline (E-Commerce Dataset)

**MCA Assignment – Unit 3**

Dataset: `ecommerce_practice`  
Collections: `customers` (20), `products` (30), `orders` (30), `payments` (20)

---

## How to Run

1. Open **MongoDB Compass** or **mongosh**.
2. Create / select database: `ecommerce_practice`.
3. Run the seed script from `seed-data.js`.
4. Run each aggregation from `solutions.js`.
5. Compare with expected outputs in this README / `OUTPUT.md`.

```bash
use ecommerce_practice
load("seed-data.js")
# then run queries from solutions.js one by one
```

---

## Questions & Solutions (Summary)

Full runnable code is in **`solutions.js`**.

| Q | Topic | Key operators |
|---|--------|---------------|
| 1 | Delivered orders, project + sort | `$match`, `$project`, `$sort` |
| 2 | Electronics rating ≥ 4.5 | `$match`, `$project` |
| 3 | 5 most expensive products | `$sort`, `$limit` |
| 4 | 3 lowest stock products | `$sort`, `$limit` |
| 5 | Gold/Platinum age > 25 | `$match`, `$project` |
| 6 | Customers per membership | `$group`, `$sort` |
| 7 | Avg price per category | `$group`, `$sort` |
| 8 | Total stock per category | `$group`, `$sort` |
| 9 | Brands avg rating > 4.4 | `$group`, `$match` |
| 10 | Orders per status | `$group`, `$sort` |
| 11 | Total quantity ordered | `$unwind`, `$group` |
| 12 | Qty sold per product | `$unwind`, `$group`, `$sort` |
| 13 | Top 5 products + name | `$unwind`, `$lookup`, `$limit` |
| 14 | Unique products in orders | `$unwind`, `$group`, `$count` |
| 15 | Items per customer | `$unwind`, `$group` |
| 16 | Orders + customer info | `$lookup`, `$project` |
| 17 | Orders + customer, sort date | `$lookup`, `$sort` |
| 18 | Delivered + Gold members | `$match`, `$lookup` |
| 19 | Orders count per customer | `$group`, `$lookup` |
| 20 | Customers with >1 order | `$group`, `$match`, `$lookup` |
| 21 | Qty sold + product details | `$unwind`, `$lookup`, `$group` |
| 22 | Top 5 Electronics by qty | `$match`, `$limit` |
| 23 | Items ordered per city | `$unwind`, `$lookup`, `$group` |
| 24 | 3 reports via `$facet` | `$facet` |
| 25 | Sales Dashboard via `$facet` | `$facet` |

---

### Q1 Example

```js
db.orders.aggregate([
  { $match: { status: "Delivered" } },
  { $project: { _id: 0, orderDate: 1, status: 1, shippingCity: 1, customerId: 1 } },
  { $sort: { orderDate: -1 } }
])
```

### Q24 Example ($facet)

```js
db.products.aggregate([
  {
    $facet: {
      productStatistics: [
        { $group: { _id: null, totalProducts: { $sum: 1 }, averagePrice: { $avg: "$price" } } },
        { $project: { _id: 0, totalProducts: 1, averagePrice: { $round: ["$averagePrice", 2] } } }
      ],
      categoryStatistics: [
        { $group: { _id: "$category", productCount: { $sum: 1 }, averagePrice: { $avg: "$price" } } },
        { $project: { _id: 0, category: "$_id", productCount: 1, averagePrice: { $round: ["$averagePrice", 2] } } },
        { $sort: { productCount: -1 } }
      ],
      ratingStatistics: [
        {
          $group: {
            _id: null,
            ratingGte45: { $sum: { $cond: [{ $gte: ["$rating", 4.5] }, 1, 0] } },
            ratingLt45: { $sum: { $cond: [{ $lt: ["$rating", 4.5] }, 1, 0] } }
          }
        },
        { $project: { _id: 0, ratingGte45: 1, ratingLt45: 1 } }
      ]
    }
  }
])
```

### Q25 Dashboard

See full pipelines in `solutions.js`:
- **orderSummary**, **customerSummary**, **productSummary** from `orders` via `$facet`
- **paymentSummary** from `payments` (Paid amounts by method)
- **categorySummary** from `products`

---

## Files

| File | Description |
|------|-------------|
| `README.md` | This file |
| `solutions.js` | All 25 aggregation pipelines |
| `seed-data.js` | Dataset insert script |
| `OUTPUT.md` | Sample expected outputs |

## Screenshots

1. Open MongoDB Compass → Aggregation tab
2. Paste stages from `solutions.js`
3. Run and screenshot result panel
4. Attach screenshots to assignment submission
