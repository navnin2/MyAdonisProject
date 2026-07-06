-- ==========================================================
-- Top 5 selling products for a given month.
-- Returns:
-- Product Name
-- Category
-- Units Sold
-- Revenue
-- Powers:
-- GET /api/store/top-products
-- ==========================================================

SELECT
    p.id,
    p.name AS product_name,
    c.name AS category_name,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.subtotal) AS revenue
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.id
JOIN products p
    ON oi.product_id = p.id
JOIN categories c
    ON p.category = c.name
WHERE DATE_FORMAT(o.ordered_at,'%Y-%m')='2025-07'
GROUP BY
    p.id,
    p.name,
    c.name
ORDER BY units_sold DESC
LIMIT 5;

-- Recommended Indexes

-- Speeds filtering by month.
-- Without this MySQL scans the entire orders table.
CREATE INDEX idx_orders_ordered_at
ON orders(ordered_at);

-- Speeds joining order_items to products.
CREATE INDEX idx_order_items_product
ON order_items(product_id);

-- Speeds joining products to categories.
CREATE INDEX idx_products_category
ON products(category_id);

-- ==========================================================
-- Products with stock below 10 and at least one
-- pending or paid order.
-- Powers:
-- GET /api/store/restock-alerts
-- ==========================================================

SELECT DISTINCT
    p.id,
    p.name,
    p.stock,
    p.price,
    c.name AS category
FROM products p
JOIN categories c
    ON c.name = p.category
JOIN order_items oi
    ON oi.product_id = p.id
JOIN orders o
    ON o.id = oi.order_id
WHERE
    p.stock < 10
AND o.status IN ('pending','paid');

-- Recommended Indexes

-- Helps stock filtering.
CREATE INDEX idx_products_stock
ON products(stock);

-- Helps filtering orders by status.
CREATE INDEX idx_orders_status
ON orders(status);

-- Helps joining order_items to products.
CREATE INDEX idx_order_items_product
ON order_items(product_id);

-- ==========================================================
-- Monthly revenue for the last 12 months.
-- Returns:
-- Month
-- Total Orders
-- Revenue
-- Average Order
-- Powers:
-- GET /api/store/revenue
-- ==========================================================

SELECT
    DATE_FORMAT(ordered_at,'%Y-%m') AS month,
    COUNT(*) AS total_orders,
    SUM(total_amount) AS revenue,
    AVG(total_amount) AS average_order
FROM orders
GROUP BY
    DATE_FORMAT(ordered_at,'%Y-%m')
ORDER BY month DESC
LIMIT 12;

-- Recommended Index

-- Prevents full table scan when sorting/filtering by date.
CREATE INDEX idx_orders_ordered_at
ON orders(ordered_at);

-- ==========================================================
-- Customers with more than 3 orders
-- but no reviews.
-- Powers:
-- GET /api/store/silent-customers
-- ==========================================================

SELECT
    c.id,
    c.name,
    c.email
FROM customers c
WHERE
(
    SELECT COUNT(*)
    FROM orders o
    WHERE o.customer_id = c.id
) > 3
AND NOT EXISTS
(
    SELECT 1
    FROM reviews r
    WHERE r.customer_id = c.id
);

-- Recommended Indexes

-- Speeds counting customer orders.
CREATE INDEX idx_orders_customer
ON orders(customer_id);

-- Speeds checking customer reviews.
CREATE INDEX idx_reviews_customer
ON reviews(customer_id);

-- ==========================================================
-- Average rating per category.
-- Only categories having at least
-- 5 reviews are returned.
-- Powers:
-- GET /api/store/category-ratings
-- ==========================================================

SELECT
    c.id,
    c.name,
    AVG(r.rating) AS average_rating,
    COUNT(r.id) AS total_reviews
FROM categories c
JOIN products p
    ON p.category = c.name
JOIN reviews r
    ON r.product_id = p.id
GROUP BY
    c.id,
    c.name
HAVING COUNT(r.id) >= 5
ORDER BY average_rating DESC;

-- Recommended Indexes

-- Speeds joining products with categories.
CREATE INDEX idx_products_category
ON products(category_id);

-- Speeds joining reviews with products.
CREATE INDEX idx_reviews_product
ON reviews(product_id);