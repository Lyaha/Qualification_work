-- Створення типів ENUM
CREATE TYPE user_role AS ENUM ('client', 'warehouse_worker', 'manager', 'admin', 'director');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'completed', 'canceled');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE movement_type AS ENUM ('incoming', 'outgoing', 'transfer');
CREATE TYPE parking_spot_status AS ENUM ('available', 'reserved', 'occupied');
CREATE TYPE supply_order_status AS ENUM ('draft', 'confirmed', 'delivered', 'completed');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');

-- Таблиця користувачів✅
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    auth0_id VARCHAR(255) UNIQUE NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Таблиця складів✅
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    working_hours TEXT,
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE
);
-- Таблиця прив’язки warehouse_worker до складів (many-to-many)✅
CREATE TABLE user_warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, warehouse_id)
);

-- Таблиця категорій✅
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES categories(id)
);

-- Таблиця товарів✅
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    barcode VARCHAR(50) UNIQUE,
    price_purchase DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(10,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця замовлень✅
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Деталі замовлень✅
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL
);

-- Відгуки✅
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Знижки✅
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

-- Постачальники✅
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255)
);

-- Заявки на поставку✅
CREATE TABLE supply_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    status supply_order_status NOT NULL,
    expected_delivery_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    warehouse_id UUID REFERENCES warehouses(id)
);

-- Деталі заявок на поставку✅
CREATE TABLE supply_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_order_id UUID NOT NULL REFERENCES supply_orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL
);

-- Парковочні місця✅
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

-- Коробки✅
CREATE TABLE boxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    length DECIMAL(10,2) NOT NULL,
    width DECIMAL(10,2) NOT NULL,
    height DECIMAL(10,2) NOT NULL,
    max_weight DECIMAL(10,2) NOT NULL,
);

-- Зони зберігання✅
CREATE TABLE storage_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    location_code VARCHAR(50) NOT NULL,
    max_weight DECIMAL(10,2) NOT NULL,
    current_weight DECIMAL(10,2) DEFAULT 0
);

-- Переміщення товарів✅
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

-- Партії товарів✅
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    current_quantity INT NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
    expiration_date DATE,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Расположение партий✅
CREATE TABLE batch_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(id),
    storage_zone_id UUID REFERENCES storage_zones(id),
    box_id UUID REFERENCES boxes(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (storage_zone_id IS NOT NULL AND box_id IS NULL) OR
        (storage_zone_id IS NOT NULL AND box_id IS NOT NULL)
    )
);


-- Історія цін✅
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Завдання працівників(workers)✅
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES users(id),
    order_item_id UUID REFERENCES order_items(id),
    supply_order_item_id UUID REFERENCES supply_order_items(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    deadline TIMESTAMP NOT NULL,
    status task_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    note TEXT,
    CHECK (
        (order_item_id IS NOT NULL AND supply_order_item_id IS NULL) OR
        (order_item_id IS NULL AND supply_order_item_id IS NOT NULL)
    )
);

-- Індекси
--CREATE INDEX idx_users_email ON users(email);
--CREATE INDEX idx_products_barcode ON products(barcode);
--CREATE INDEX idx_orders_client_id ON orders(client_id);
--CREATE INDEX idx_order_items_order_id ON order_items(order_id);
--CREATE INDEX idx_discounts_product_id ON discounts(product_id);
--CREATE INDEX idx_inventory_movements_product_id ON inventory_movements(product_id);
--CREATE INDEX idx_batch_locations_batch_id ON batch_locations(batch_id);
--CREATE INDEX idx_batch_locations_storage_zone_id ON batch_locations(storage_zone_id);
--CREATE INDEX idx_batch_locations_box_id ON batch_locations(box_id);
CREATE INDEX idx_batches_product_warehouse ON batches(product_id, warehouse_id);

-- Тригер для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE orders 
    SET 
      total_amount = (
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM order_items 
        WHERE order_id = OLD.order_id
      ),
      updated_at = NOW()
    WHERE id = OLD.order_id;
  ELSE
    UPDATE orders 
    SET 
      total_amount = (
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM order_items 
        WHERE order_id = NEW.order_id
      ),
      updated_at = NOW()
    WHERE id = NEW.order_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reserve_parking_spot_on_order()
RETURNS TRIGGER AS $$
DECLARE
  spot_id UUID;
BEGIN
  SELECT id INTO spot_id
  FROM parking_spots
  WHERE warehouse_id = NEW.warehouse_id
    AND status = 'available'
  LIMIT 1;

  IF spot_id IS NOT NULL THEN
    UPDATE parking_spots
    SET 
      status = 'reserved',
      reserved_until = NOW() + INTERVAL '1 day',
      reference_id = NEW.id,
      entity_type = 'order'
    WHERE id = spot_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_batches_on_outgoing(
    product_id UUID,
    quantity_to_remove INT
) RETURNS VOID AS $$
BEGIN
    UPDATE batches b
    SET current_quantity = current_quantity - quantity_to_remove
    WHERE b.product_id = update_batches_on_outgoing.product_id
    AND b.current_quantity >= quantity_to_remove;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_inventory_movement()
RETURNS TRIGGER AS $$
DECLARE
    prod_weight DECIMAL(10,2);
    new_batch_id UUID;
    v_warehouse_id UUID;
BEGIN
    -- Получаем вес продукта
    SELECT weight INTO prod_weight
    FROM products
    WHERE id = NEW.product_id;

    CASE NEW.movement_type
        WHEN 'incoming' THEN
            -- Получаем warehouse_id из зоны хранения
            SELECT warehouse_id INTO v_warehouse_id 
            FROM storage_zones WHERE id = NEW.to_zone_id;
            
            -- Создаем новую партию
            INSERT INTO batches (
                product_id, 
                warehouse_id, 
                quantity, 
                current_quantity, 
                received_at
            )
            VALUES (
                NEW.product_id, 
                v_warehouse_id, 
                NEW.quantity, 
                NEW.quantity, 
                NOW()
            )
            RETURNING id INTO new_batch_id;

            -- Обновляем ссылку в движении
            NEW.reference_id := new_batch_id;

            -- Создаем запись в batch_locations
            INSERT INTO batch_locations (
                batch_id, 
                storage_zone_id, 
                quantity
            )
            VALUES (
                new_batch_id, 
                NEW.to_zone_id, 
                NEW.quantity
            );

        WHEN 'transfer' THEN
            -- Исправленный блок
            PERFORM validate_source_availability(
                NEW.from_zone_id, 
                NEW.product_id, 
                NEW.quantity
            );

            -- Обновление расположения
            UPDATE batch_locations
            SET storage_zone_id = NEW.to_zone_id
            WHERE storage_zone_id = NEW.from_zone_id
            AND batch_id IN (
                SELECT id FROM batches 
                WHERE product_id = NEW.product_id
            );
    END CASE;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_source_availability(
    source_zone_id UUID,
    product_id UUID,
    required_quantity INT
) RETURNS VOID AS $$
DECLARE
    available_quantity INT;
BEGIN
    SELECT COALESCE(SUM(bl.quantity), 0)
    INTO available_quantity
    FROM batch_locations bl
    JOIN batches b ON bl.batch_id = b.id
    WHERE bl.storage_zone_id = source_zone_id
    AND b.product_id = validate_source_availability.product_id;

    IF available_quantity < required_quantity THEN
        RAISE EXCEPTION 'Not enough stock. Available: %, Requested: %', 
            available_quantity, required_quantity;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_storage_weight(
    zone_id UUID, 
    box_id UUID, 
    weight_diff DECIMAL(10,2)
)
RETURNS VOID AS $$
BEGIN
    IF zone_id IS NOT NULL THEN
        UPDATE storage_zones
        SET current_weight = current_weight + weight_diff
        WHERE id = zone_id
        AND current_weight + weight_diff BETWEEN 0 AND max_weight;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Zone % weight out of bounds', zone_id;
        END IF;
    END IF;

    IF box_id IS NOT NULL THEN
        UPDATE boxes
        SET current_weight = current_weight + weight_diff
        WHERE id = box_id
        AND current_weight + weight_diff BETWEEN 0 AND max_weight;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Box % weight out of bounds', box_id;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_transfer(
    from_id UUID,
    to_id UUID,
    product_id UUID,
    quantity INT,
    product_weight DECIMAL
) RETURNS VOID AS $$
DECLARE
    total_weight DECIMAL := quantity * product_weight;
BEGIN
    PERFORM validate_source_availability(from_id, product_id, quantity);
    
    -- Проверка места в целевой зоне
    IF (SELECT (current_weight + total_weight) > max_weight 
        FROM storage_zones WHERE id = to_id) THEN
        RAISE EXCEPTION 'Not enough space in target zone %', to_id;
    END IF;

    -- Обновление весов
    PERFORM update_storage_weight(from_id, NULL, -total_weight);
    PERFORM update_storage_weight(to_id, NULL, total_weight);

    -- Обновление расположения
    UPDATE batch_locations
    SET storage_zone_id = to_id
    WHERE storage_zone_id = from_id
    AND batch_id IN (
        SELECT id FROM batches 
        WHERE product_id = process_transfer.product_id
    );
END;
$$ LANGUAGE plpgsql;

-- 1. Триггер для обновления весов
CREATE OR REPLACE FUNCTION batch_location_weight()
RETURNS TRIGGER AS $$
DECLARE
    prod_weight DECIMAL(10,2);
    zone_max DECIMAL(10,2);
    box_max DECIMAL(10,2);
BEGIN
    -- Получаем вес продукта
    SELECT p.weight INTO prod_weight
    FROM products p
    JOIN batches b ON b.product_id = p.id
    WHERE b.id = COALESCE(NEW.batch_id, OLD.batch_id);

    -- Обработка для разных операций
    CASE TG_OP
        WHEN 'INSERT' THEN
            -- Проверка зоны
            SELECT max_weight INTO zone_max 
            FROM storage_zones 
            WHERE id = NEW.storage_zone_id;
            
            IF (NEW.quantity * prod_weight) > zone_max THEN
                RAISE EXCEPTION 'Zone % capacity exceeded. Max: %, Required: %',
                    NEW.storage_zone_id, 
                    zone_max,
                    NEW.quantity * prod_weight;
            END IF;

            -- Обновление веса зоны
            UPDATE storage_zones
            SET current_weight = current_weight + (NEW.quantity * prod_weight)
            WHERE id = NEW.storage_zone_id;

            -- Обновление коробки при наличии
            IF NEW.box_id IS NOT NULL THEN
                SELECT max_weight INTO box_max 
                FROM boxes 
                WHERE id = NEW.box_id;
                
                IF (NEW.quantity * prod_weight) > box_max THEN
                    RAISE EXCEPTION 'Box % capacity exceeded. Max: %, Required: %',
                        NEW.box_id, 
                        box_max,
                        NEW.quantity * prod_weight;
                END IF;

                UPDATE boxes
                SET current_weight = current_weight + (NEW.quantity * prod_weight)
                WHERE id = NEW.box_id;
            END IF;

        WHEN 'UPDATE' THEN
            -- Откат старого веса
            UPDATE storage_zones
            SET current_weight = current_weight - (OLD.quantity * prod_weight)
            WHERE id = OLD.storage_zone_id;

            IF OLD.box_id IS NOT NULL THEN
                UPDATE boxes
                SET current_weight = current_weight - (OLD.quantity * prod_weight)
                WHERE id = OLD.box_id;
            END IF;

            -- Применение нового веса
            UPDATE storage_zones
            SET current_weight = current_weight + (NEW.quantity * prod_weight)
            WHERE id = NEW.storage_zone_id;

            IF NEW.box_id IS NOT NULL THEN
                UPDATE boxes
                SET current_weight = current_weight + (NEW.quantity * prod_weight)
                WHERE id = NEW.box_id;
            END IF;

        WHEN 'DELETE' THEN
            UPDATE storage_zones
            SET current_weight = current_weight - (OLD.quantity * prod_weight)
            WHERE id = OLD.storage_zone_id;

            IF OLD.box_id IS NOT NULL THEN
                UPDATE boxes
                SET current_weight = current_weight - (OLD.quantity * prod_weight)
                WHERE id = OLD.box_id;
            END IF;
    END CASE;
    RETURN CASE TG_OP WHEN 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_warehouse_worker_role()
RETURNS TRIGGER AS $$
DECLARE
  user_role user_role;
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE id = NEW.user_id;

  IF user_role != 'warehouse_worker' THEN
    RAISE EXCEPTION 'Only warehouse workers can be assigned to warehouses';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_price_history()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.price <> NEW.price THEN
        INSERT INTO price_history (product_id, old_price, new_price, changed_by)
        VALUES (OLD.id, OLD.price, NEW.price, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_movement_from_batch_location()
RETURNS TRIGGER AS $$
DECLARE
    system_user_id UUID;  -- Объявляем переменную здесь
    context_var TEXT;
BEGIN
    -- Получаем ID первого пользователя
    SELECT id INTO system_user_id
    FROM users
    ORDER BY created_at
    LIMIT 1;

    IF system_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found in system';
    END IF;

    -- Проверяем контекст вызова
    GET DIAGNOSTICS context_var = PG_CONTEXT;
    IF context_var NOT LIKE '%process_inventory_movement%' THEN
        INSERT INTO inventory_movements (
            product_id,
            to_zone_id,
            quantity,
            movement_type,
            user_id,
            reference_id,
            created_at
        )
        SELECT
            b.product_id,
            NEW.storage_zone_id,
            NEW.quantity,
            'incoming',
            system_user_id,  -- Используем объявленную переменную
            NEW.batch_id,
            NOW()
        FROM batches b
        WHERE b.id = NEW.batch_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригери для автоматизації
CREATE TRIGGER check_warehouse_worker_before_insert
BEFORE INSERT ON user_warehouses
FOR EACH ROW EXECUTE FUNCTION check_warehouse_worker_role();

CREATE TRIGGER trigger_log_price_history
AFTER UPDATE OF price ON products
FOR EACH ROW EXECUTE FUNCTION log_price_history();

CREATE TRIGGER trigger_create_movement_from_batch_location
AFTER INSERT ON batch_locations
FOR EACH ROW 
EXECUTE FUNCTION create_movement_from_batch_location();

CREATE TRIGGER check_warehouse_worker_before_update
BEFORE UPDATE ON user_warehouses
FOR EACH ROW EXECUTE FUNCTION check_warehouse_worker_role();

CREATE TRIGGER batch_location_weight_trigger
AFTER INSERT OR UPDATE OR DELETE ON batch_locations
FOR EACH ROW EXECUTE FUNCTION batch_location_weight();

CREATE TRIGGER order_total_update
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trigger_reserve_parking_spot
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION reserve_parking_spot_on_order();

CREATE TRIGGER inventory_movement_processing
BEFORE INSERT ON inventory_movements
FOR EACH ROW EXECUTE FUNCTION process_inventory_movement();

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

CREATE TABLE storage_weight_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES storage_zones(id),
    old_weight DECIMAL(10,2),
    new_weight DECIMAL(10,2),
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_storage_weight_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO storage_weight_history(zone_id, old_weight, new_weight)
    VALUES (OLD.id, OLD.current_weight, NEW.current_weight);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_storage_weight_changes
AFTER UPDATE ON storage_zones
FOR EACH ROW EXECUTE FUNCTION log_storage_weight_changes();
