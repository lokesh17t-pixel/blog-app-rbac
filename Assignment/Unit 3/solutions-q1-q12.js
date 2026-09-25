// ============================================================
// Unit 3 — MongoDB Aggregation Pipeline Solutions (Q1–Q12)
// Database: ecommerce_practice
// ============================================================

// Q1. Delivered orders
db.orders.aggregate([
  { $match: { status: "Delivered" } },
  {
    $project: {
      _id: 0,
      orderDate: 1,
      status: 1,
      shippingCity: 1,
      customerId: 1
    }
  },
  { $sort: { orderDate: -1 } }
]);

// Q2. Electronics rating >= 4.5
db.products.aggregate([
  {
    $match: {
      category: "Electronics",
      rating: { $gte: 4.5 }
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      brand: 1,
      price: 1,
      rating: 1
    }
  }
]);

// Q3. 5 most expensive products
db.products.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      category: 1,
      brand: 1,
      price: 1
    }
  },
  { $sort: { price: -1 } },
  { $limit: 5 }
]);

// Q4. 3 products with lowest stock
db.products.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      category: 1,
      stock: 1,
      price: 1
    }
  },
  { $sort: { stock: 1 } },
  { $limit: 3 }
]);

// Q5. Gold or Platinum members older than 25
db.customers.aggregate([
  {
    $match: {
      membership: { $in: ["Gold", "Platinum"] },
      age: { $gt: 25 }
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      city: 1,
      age: 1,
      membership: 1
    }
  }
]);

// Q6. Customer count per membership
db.customers.aggregate([
  {
    $group: {
      _id: "$membership",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  {
    $project: {
      _id: 0,
      membership: "$_id",
      count: 1
    }
  }
]);

// Q7. Average product price per category
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" }
    }
  },
  { $sort: { averagePrice: -1 } },
  {
    $project: {
      _id: 0,
      category: "$_id",
      averagePrice: { $round: ["$averagePrice", 2] }
    }
  }
]);

// Q8. Total stock per category
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      totalStock: { $sum: "$stock" }
    }
  },
  { $sort: { totalStock: -1 } },
  {
    $project: {
      _id: 0,
      category: "$_id",
      totalStock: 1
    }
  }
]);

// Q9. Brands with average rating > 4.4
db.products.aggregate([
  {
    $group: {
      _id: "$brand",
      avgRating: { $avg: "$rating" }
    }
  },
  { $match: { avgRating: { $gt: 4.4 } } },
  {
    $project: {
      _id: 0,
      brand: "$_id",
      avgRating: { $round: ["$avgRating", 2] }
    }
  },
  { $sort: { avgRating: -1 } }
]);

// Q10. Order count per status
db.orders.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  {
    $project: {
      _id: 0,
      status: "$_id",
      count: 1
    }
  }
]);

// Q11. Total quantity ordered
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: null,
      totalQuantity: { $sum: "$items.quantity" }
    }
  },
  {
    $project: {
      _id: 0,
      totalQuantity: 1
    }
  }
]);

// Q12. Total quantity sold per product
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalQuantity: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalQuantity: -1 } },
  {
    $project: {
      _id: 0,
      productId: "$_id",
      totalQuantity: 1
    }
  }
]);
