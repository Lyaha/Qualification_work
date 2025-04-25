-- Створення типів ENUM
CREATE TYPE user_role AS ENUM ('client', 'warehouse_worker', 'manager', 'admin', 'director');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'completed', 'canceled');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE movement_type AS ENUM ('incoming', 'outgoing', 'transfer');
CREATE TYPE parking_spot_status AS ENUM ('available', 'reserved', 'occupied');
CREATE TYPE supply_order_status AS ENUM ('draft', 'confirmed', 'delivered');

-- Таблиця користувачів
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth0_id VARCHAR(255) UNIQUE NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Таблиця складів
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    working_hours TEXT,
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- Таблиця категорій
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES categories(id)
);

-- Таблиця товарів
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id),
    barcode VARCHAR(50) UNIQUE,
    price_purchase DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(10,2),
    expiration_date DATE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    storage_location VARCHAR(255)
);

-- Таблиця замовлень
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id)
);

-- Деталі замовлень
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL
);

-- Відгуки
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Знижки
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    product_id UUID REFERENCES products(id),
    category_id UUID REFERENCES categories(id),
    discount_type discount_type NOT NULL,
    value DECIMAL(10,2) NOT NULL CHECK (value > 0),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    min_quantity INT,
    is_stackable BOOLEAN DEFAULT FALSE,
    CHECK (start_date < end_date),
    CHECK (
        (product_id IS NOT NULL AND category_id IS NULL) OR
        (product_id IS NULL AND category_id IS NOT NULL)
    )
);

-- Постачальники
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255)
);

-- Заявки на поставку
CREATE TABLE supply_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    status supply_order_status NOT NULL,
    expected_delivery_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Деталі заявок на поставку
CREATE TABLE supply_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_order_id UUID NOT NULL REFERENCES supply_orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL
);

-- Парковочні місця
CREATE TABLE parking_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    status parking_spot_status NOT NULL,
    reserved_until TIMESTAMP,
    reference_id UUID,
    entity_type VARCHAR(50)
);

-- Логи
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Коробки
CREATE TABLE boxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    length DECIMAL(10,2) NOT NULL,
    width DECIMAL(10,2) NOT NULL,
    height DECIMAL(10,2) NOT NULL,
    max_weight DECIMAL(10,2) NOT NULL
);

-- Зони зберігання
CREATE TABLE storage_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    location_code VARCHAR(50) NOT NULL,
    max_weight DECIMAL(10,2) NOT NULL
);

-- Переміщення товарів
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    from_zone_id UUID REFERENCES storage_zones(id),
    to_zone_id UUID REFERENCES storage_zones(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    movement_type movement_type NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_id UUID,
    note TEXT
);

-- Партії товарів
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    expiration_date DATE,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Історія цін
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Індекси
--CREATE INDEX idx_users_email ON users(email);
--CREATE INDEX idx_products_barcode ON products(barcode);
--CREATE INDEX idx_orders_client_id ON orders(client_id);
--CREATE INDEX idx_order_items_order_id ON order_items(order_id);
--CREATE INDEX idx_discounts_product_id ON discounts(product_id);
--CREATE INDEX idx_inventory_movements_product_id ON inventory_movements(product_id);

-- Тригер для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Додавання тригерів для оновлення часу
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DO $$
BEGIN
  IF CURRENT_SETTING('SEED_TEST_DATA') = 'true' THEN
    \ir seed-test-data.sql
  END IF;
END $$;