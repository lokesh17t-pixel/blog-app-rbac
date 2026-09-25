# Sample Outputs — Unit 3 Aggregations

Run each query from `solutions.js` in **mongosh** or **MongoDB Compass** and compare.

---

## Q1 — Delivered orders (newest first)

Approx **18** Delivered documents, sorted by `orderDate` descending.

---

## Q3 — Top 5 expensive products

| name | category | brand | price |
|------|----------|-------|-------|
| MacBook Air M3 | Electronics | Apple | 115000 |
| Sony Bravia 55 TV | Electronics | Sony | 78000 |
| Samsung Galaxy S24 | Electronics | Samsung | 72000 |
| iPhone 15 | Electronics | Apple | 65000 |
| Dell Inspiron 15 | Electronics | Dell | 62000 |

---

## Q4 — Lowest stock (3)

| name | stock |
|------|-------|
| Sony Bravia 55 TV | 10 |
| MacBook Air M3 | 12 |
| Fossil Gen 6 | 14 |

---

## Q6 — Membership counts

| membership | count |
|------------|-------|
| Gold | 9 |
| Silver | 8 |
| Platinum | 3 |

---

## Q10 — Orders by status

| status | count (approx) |
|--------|----------------|
| Delivered | 18 |
| Shipped | 5 |
| Pending | 5 |
| Cancelled | 2 |

---

## Q20 — Customers with more than 1 order

Rahul Sharma, Priya Singh, Vikram Mehta, Rohit Kumar, Kavya Rao, Karan Shah, Sahil Khan, Manish Agarwal, Nitin Jain (and others with 2 orders).

---

## Q24 — $facet result shape

```js
[
  {
    productStatistics: [ { totalProducts: 30, averagePrice: ... } ],
    categoryStatistics: [ { category, productCount, averagePrice }, ... ],
    ratingStatistics: [ { ratingGte45: ..., ratingLt45: ... } ]
  }
]
```

---

## Q25 — Dashboard shape

```js
[
  {
    orderSummary: [ { total, delivered, pending, cancelled, shipped } ],
    customerSummary: [ { name, city, membership, orderCount }, ... ],
    productSummary: [ { productName, category, brand, totalQuantitySold }, ... ]
  }
]
```

Plus Payment Summary and Category Summary from companion pipelines in `solutions.js`.

---

## Screenshots (MongoDB Compass)

1. Select collection → **Aggregations** tab  
2. Paste stages from `solutions.js`  
3. Click **Run** → screenshot the result panel  
4. Attach to assignment submission  
