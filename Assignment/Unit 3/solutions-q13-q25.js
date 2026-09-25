// ============================================================
// Unit 3 — MongoDB Aggregation Pipeline Solutions (Q13–Q25)
// ============================================================

// Q13. Top 5 most ordered products with name
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalQuantity: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      _id: 0,
      productId: "$_id",
      productName: "$product.name",
      totalQuantity: 1
    }
  }
]);

// Q14. Unique products in orders
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.productId" } },
  { $count: "uniqueProducts" }
]);

// Q15. Total items per customer
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$customerId",
      totalItems: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalItems: -1 } },
  {
    $project: {
      _id: 0,
      customerId: "$_id",
      totalItems: 1
    }
  }
]);

// Q16. Orders + customer name, email, city
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 1,
      orderDate: 1,
      status: 1,
      shippingCity: 1,
      customerName: "$customer.name",
      customerEmail: "$customer.email",
      customerCity: "$customer.city"
    }
  }
]);

// Q17. Orders + customer, sort by date desc
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customerName: "$customer.name",
      orderDate: 1,
      status: 1,
      shippingCity: 1
    }
  },
  { $sort: { orderDate: -1 } }
]);

// Q18. Delivered orders by Gold members
db.orders.aggregate([
  { $match: { status: "Delivered" } },
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  { $match: { "customer.membership": "Gold" } },
  {
    $project: {
      _id: 1,
      orderDate: 1,
      status: 1,
      shippingCity: 1,
      customerName: "$customer.name",
      membership: "$customer.membership"
    }
  }
]);

// Q19. Total orders per customer
db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",
      totalOrders: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customerName: "$customer.name",
      city: "$customer.city",
      totalOrders: 1
    }
  },
  { $sort: { totalOrders: -1 } }
]);

// Q20. Customers with more than one order
db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",
      numberOfOrders: { $sum: 1 }
    }
  },
  { $match: { numberOfOrders: { $gt: 1 } } },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      name: "$customer.name",
      membership: "$customer.membership",
      city: "$customer.city",
      numberOfOrders: 1
    }
  },
  { $sort: { numberOfOrders: -1 } }
]);

// Q21. Qty sold per product with name, category, brand
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalQuantitySold: { $sum: "$items.quantity" }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      _id: 0,
      productName: "$product.name",
      category: "$product.category",
      brand: "$product.brand",
      totalQuantitySold: 1
    }
  },
  { $sort: { totalQuantitySold: -1 } }
]);

// Q22. Top 5 Electronics by quantity sold
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalQuantitySold: { $sum: "$items.quantity" }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  { $match: { "product.category": "Electronics" } },
  { $sort: { totalQuantitySold: -1 } },
  { $limit: 5 },
  {
    $project: {
      _id: 0,
      productName: "$product.name",
      brand: "$product.brand",
      price: "$product.price",
      totalQuantitySold: 1
    }
  }
]);

// Q23. Total items ordered per city
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $group: {
      _id: "$customer.city",
      totalQuantity: { $sum: "$items.quantity" }
    }
  },
  {
    $project: {
      _id: 0,
      city: "$_id",
      totalQuantity: 1
    }
  },
  { $sort: { totalQuantity: -1 } }
]);

// Q24. $facet — 3 reports
db.products.aggregate([
  {
    $facet: {
      productStatistics: [
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            averagePrice: { $avg: "$price" }
          }
        },
        {
          $project: {
            _id: 0,
            totalProducts: 1,
            averagePrice: { $round: ["$averagePrice", 2] }
          }
        }
      ],
      categoryStatistics: [
        {
          $group: {
            _id: "$category",
            productCount: { $sum: 1 },
            averagePrice: { $avg: "$price" }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            productCount: 1,
            averagePrice: { $round: ["$averagePrice", 2] }
          }
        },
        { $sort: { productCount: -1 } }
      ],
      ratingStatistics: [
        {
          $group: {
            _id: null,
            ratingGte45: {
              $sum: { $cond: [{ $gte: ["$rating", 4.5] }, 1, 0] }
            },
            ratingLt45: {
              $sum: { $cond: [{ $lt: ["$rating", 4.5] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            ratingGte45: 1,
            ratingLt45: 1
          }
        }
      ]
    }
  }
]);

// Q25. Sales Dashboard ($facet on orders)
db.orders.aggregate([
  {
    $facet: {
      orderSummary: [
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            delivered: {
              $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] }
            },
            shipped: {
              $sum: { $cond: [{ $eq: ["$status", "Shipped"] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            total: 1,
            delivered: 1,
            pending: 1,
            cancelled: 1,
            shipped: 1
          }
        }
      ],
      customerSummary: [
        {
          $group: {
            _id: "$customerId",
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "_id",
            as: "customer"
          }
        },
        { $unwind: "$customer" },
        {
          $project: {
            _id: 0,
            name: "$customer.name",
            city: "$customer.city",
            membership: "$customer.membership",
            orderCount: 1
          }
        }
      ],
      productSummary: [
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            totalQuantitySold: { $sum: "$items.quantity" }
          }
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,
            productName: "$product.name",
            category: "$product.category",
            brand: "$product.brand",
            totalQuantitySold: 1
          }
        }
      ]
    }
  }
]);

// Q25 companion — Payment Summary
db.payments.aggregate([
  { $match: { status: "Paid" } },
  {
    $group: {
      _id: "$method",
      totalAmount: { $sum: "$amount" }
    }
  },
  {
    $project: {
      _id: 0,
      method: "$_id",
      totalAmount: 1
    }
  },
  { $sort: { totalAmount: -1 } }
]);

// Q25 companion — Category Summary
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      productCount: { $sum: 1 },
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      productCount: 1,
      averagePrice: { $round: ["$averagePrice", 2] }
    }
  },
  { $sort: { productCount: -1 } }
]);
