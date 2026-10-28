-- ===========================
-- TimeAI Watch Store Database
-- Initial Schema Creation
-- ===========================

-- Create extension for UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- USERS TABLE
-- ===========================
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN')),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ===========================
-- ADDRESSES TABLE
-- ===========================
CREATE TABLE addresses (
  id VARCHAR(50) PRIMARY KEY,
  "userId" VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  "zipCode" VARCHAR(20) NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT FALSE,
  "addressType" VARCHAR(20) NOT NULL CHECK("addressType" IN ('SHIPPING', 'BILLING', 'BOTH')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_userId ON addresses("userId");

-- ===========================
-- CATEGORIES TABLE
-- ===========================
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  icon VARCHAR(500),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ===========================
-- PRODUCTS TABLE
-- ===========================
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "originalPrice" DECIMAL(10, 2),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  material VARCHAR(100) NOT NULL,
  "waterResistance" VARCHAR(50) NOT NULL,
  movement VARCHAR(20) NOT NULL CHECK(movement IN ('MECHANICAL', 'AUTOMATIC', 'QUARTZ', 'DIGITAL')),
  thumbnail VARCHAR(500) NOT NULL,
  images TEXT[] NOT NULL,
  "categoryId" VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  stock INTEGER NOT NULL DEFAULT 0,
  sold INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_categoryId ON products("categoryId");
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_isFeatured ON products("isFeatured");
CREATE INDEX idx_products_isActive ON products("isActive");

-- ===========================
-- INVENTORY TABLE
-- ===========================
CREATE TABLE inventory (
  id VARCHAR(50) PRIMARY KEY,
  "productId" VARCHAR(50) NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  "reorderLevel" INTEGER NOT NULL DEFAULT 10,
  "reorderQuantity" INTEGER NOT NULL DEFAULT 50,
  warehouse VARCHAR(255),
  location VARCHAR(255),
  "lastRestockDate" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- ORDERS TABLE
-- ===========================
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  "orderNumber" VARCHAR(50) NOT NULL UNIQUE,
  "userId" VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED')),
  "paymentStatus" VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK("paymentStatus" IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  "shippingStatus" VARCHAR(20) NOT NULL DEFAULT 'NOT_SHIPPED' CHECK("shippingStatus" IN ('NOT_SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED')),
  "shippingAddressId" VARCHAR(50) NOT NULL,
  "billingAddressId" VARCHAR(50) NOT NULL,
  "trackingNumber" VARCHAR(100),
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" TIMESTAMP,
  "shippedAt" TIMESTAMP,
  "deliveredAt" TIMESTAMP
);

CREATE INDEX idx_orders_userId ON orders("userId");
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_paymentStatus ON orders("paymentStatus");
CREATE INDEX idx_orders_shippingStatus ON orders("shippingStatus");
CREATE INDEX idx_orders_orderNumber ON orders("orderNumber");

-- ===========================
-- ORDER ITEMS TABLE
-- ===========================
CREATE TABLE order_items (
  id VARCHAR(50) PRIMARY KEY,
  "orderId" VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  "productId" VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("orderId", "productId")
);

CREATE INDEX idx_order_items_orderId ON order_items("orderId");
CREATE INDEX idx_order_items_productId ON order_items("productId");

-- ===========================
-- PAYMENTS TABLE
-- ===========================
CREATE TABLE payments (
  id VARCHAR(50) PRIMARY KEY,
  "orderId" VARCHAR(50) NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  "userId" VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  "paymentMethod" VARCHAR(20) NOT NULL CHECK("paymentMethod" IN ('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'DIGITAL_WALLET')),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  "transactionId" VARCHAR(255),
  "stripeChargeId" VARCHAR(255),
  "paypalTransactionId" VARCHAR(255),
  "lastFourDigits" VARCHAR(4),
  "cardBrand" VARCHAR(50),
  "failureReason" TEXT,
  "failureCode" VARCHAR(50),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_orderId ON payments("orderId");
CREATE INDEX idx_payments_userId ON payments("userId");
CREATE INDEX idx_payments_transactionId ON payments("transactionId");
CREATE INDEX idx_payments_status ON payments(status);

-- ===========================
-- SHIPMENTS TABLE
-- ===========================
CREATE TABLE shipments (
  id VARCHAR(50) PRIMARY KEY,
  "orderId" VARCHAR(50) NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(100) NOT NULL,
  "trackingNumber" VARCHAR(100) NOT NULL UNIQUE,
  "estimatedDelivery" TIMESTAMP,
  "actualDelivery" TIMESTAMP,
  weight DECIMAL(8, 2),
  dimensions VARCHAR(100),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shipments_orderId ON shipments("orderId");
CREATE INDEX idx_shipments_trackingNumber ON shipments("trackingNumber");

-- ===========================
-- REVIEWS TABLE
-- ===========================
CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  "productId" VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  "userId" VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  comment TEXT,
  helpful INTEGER NOT NULL DEFAULT 0,
  unhelpful INTEGER NOT NULL DEFAULT 0,
  "isVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("productId", "userId")
);

CREATE INDEX idx_reviews_productId ON reviews("productId");
CREATE INDEX idx_reviews_userId ON reviews("userId");
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);

-- ===========================
-- WISHLIST ITEMS TABLE
-- ===========================
CREATE TABLE wishlist_items (
  id VARCHAR(50) PRIMARY KEY,
  "userId" VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "productId" VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "productId")
);

CREATE INDEX idx_wishlist_items_userId ON wishlist_items("userId");
CREATE INDEX idx_wishlist_items_productId ON wishlist_items("productId");

-- ===========================
-- AUDIT LOGS TABLE
-- ===========================
CREATE TABLE audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  "userId" VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  "entityId" VARCHAR(50) NOT NULL,
  changes TEXT,
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_userId ON audit_logs("userId");
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_entityId ON audit_logs("entityId");
CREATE INDEX idx_audit_logs_createdAt ON audit_logs("createdAt");

-- ===========================
-- VIEWS FOR COMMON QUERIES
-- ===========================

-- View for order summaries
CREATE VIEW order_summaries AS
SELECT 
  o.id,
  o."orderNumber",
  o."userId",
  CONCAT(u."firstName", ' ', u."lastName") AS "customerName",
  o.total,
  o.status,
  o."paymentStatus",
  o."shippingStatus",
  COUNT(oi.id) AS "itemCount",
  o."createdAt"
FROM orders o
JOIN users u ON o."userId" = u.id
LEFT JOIN order_items oi ON o.id = oi."orderId"
GROUP BY o.id, u.id;

-- View for product statistics
CREATE VIEW product_statistics AS
SELECT 
  p.id,
  p.name,
  p.brand,
  p.price,
  p.stock,
  p.sold,
  COALESCE(AVG(r.rating), 0) AS "avgRating",
  COUNT(r.id) AS "reviewCount",
  COUNT(w.id) AS "wishlistCount"
FROM products p
LEFT JOIN reviews r ON p.id = r."productId" AND r.status = 'APPROVED'
LEFT JOIN wishlist_items w ON p.id = w."productId"
GROUP BY p.id;

-- ===========================
-- STORED PROCEDURES
-- ===========================

-- Procedure to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_total(order_id VARCHAR(50))
RETURNS TABLE(subtotal DECIMAL, tax DECIMAL, total DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(oi.subtotal), 0::DECIMAL) AS subtotal,
    COALESCE(SUM(oi.subtotal), 0::DECIMAL) * 0.1 AS tax,
    COALESCE(SUM(oi.subtotal), 0::DECIMAL) * 1.1 + 15 AS total
  FROM order_items oi
  WHERE oi."orderId" = order_id;
END;
$$ LANGUAGE plpgsql;

-- Procedure to update product rating
CREATE OR REPLACE FUNCTION update_product_rating(product_id VARCHAR(50))
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET 
    rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE "productId" = product_id AND status = 'APPROVED'), 0),
    "reviewCount" = (SELECT COUNT(*) FROM reviews WHERE "productId" = product_id AND status = 'APPROVED')
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- ===========================
-- TRIGGERS
-- ===========================

-- Trigger to update product rating when review is created/updated
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_product_rating(NEW."productId");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_review_update_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_product_rating();

-- Trigger to update product rating when review is deleted
CREATE OR REPLACE FUNCTION trigger_update_product_rating_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_product_rating(OLD."productId");
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_review_delete_rating
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_product_rating_delete();

-- Trigger to update inventory when order item is created
CREATE OR REPLACE FUNCTION trigger_update_inventory()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory
  SET quantity = quantity - NEW.quantity
  WHERE "productId" = NEW."productId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_order_item_update_inventory
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION trigger_update_inventory();

-- Trigger to log changes to audit table
CREATE OR REPLACE FUNCTION trigger_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (id, action, entity, "entityId", changes, "createdAt")
  VALUES (
    substring(md5(random()::text) from 1 for 50),
    TG_ARGV[0],
    TG_TABLE_NAME,
    NEW.id::text,
    row_to_json(NEW),
    CURRENT_TIMESTAMP
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach audit trigger to key tables
CREATE TRIGGER tr_users_audit
AFTER INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_audit_log('UPDATE');

CREATE TRIGGER tr_orders_audit
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION trigger_audit_log('UPDATE');

CREATE TRIGGER tr_payments_audit
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION trigger_audit_log('UPDATE');

-- ===========================
-- COMMENTS
-- ===========================

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE products IS 'Stores product catalog information';
COMMENT ON TABLE orders IS 'Stores customer orders';
COMMENT ON TABLE payments IS 'Stores payment transactions';
COMMENT ON TABLE reviews IS 'Stores product reviews and ratings';
COMMENT ON TABLE wishlist_items IS 'Stores user wishlist items';
COMMENT ON TABLE inventory IS 'Stores product inventory levels';
COMMENT ON TABLE audit_logs IS 'Stores audit trail of system changes';
