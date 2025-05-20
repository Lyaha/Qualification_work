-- Заповнення users
INSERT INTO users (id, first_name, last_name, auth0_id, email, role, phone_number, is_active, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'testname1', 'testlastname1', 'auth0|user1client',  'client1@test.com',  'client',          '+3801111111', TRUE, now(), now()),
(gen_random_uuid(), 'testname2', 'testlastname2', 'auth0|user2worker',  'worker1@test.com',  'warehouse_worker','+3802222222', TRUE, now(), now()),
(gen_random_uuid(), 'testname3', 'testlastname3', 'auth0|user3manager', 'manager1@test.com', 'manager',         '+3803333333', TRUE, now(), now()),
(gen_random_uuid(), 'testname4', 'testlastname4', 'auth0|user4admin',   'admin1@test.com',   'admin',           '+3804444444', TRUE, now(), now()),
(gen_random_uuid(), 'testname5', 'testlastname5', 'auth0|user5director','director1@test.com','director',        '+3805555555', TRUE, now(), now());
-- Заповнення warehouses
INSERT INTO warehouses (name, location, working_hours) 
VALUES 
('Склад А', 'Київ, вул. Центральна 1', '08:00-20:00'),
('Склад Б', 'Львів, вул. Головна 5', '09:00-18:00'),
('Склад В', 'Одеса, вул. Морська 12', '10:00-22:00'),
('Склад Г', 'Харків, вул. Промислова 7', '00:00-23:59'),
('Склад Д', 'Дніпро, вул. Заводська 3', '07:00-19:00');

-- Заповнення categories
INSERT INTO categories (name, parent_id) 
VALUES 
('Електроніка', NULL),
('Ноутбуки', (SELECT id FROM categories WHERE name = 'Електроніка')),
('Смартфони', (SELECT id FROM categories WHERE name = 'Електроніка')),
('Побутова техніка', NULL),
('Холодильники', (SELECT id FROM categories WHERE name = 'Побутова техніка'));

-- Заповнення products
INSERT INTO products (name, description, category_id, barcode, price_purchase, price, weight, category) 
VALUES 
('Ноутбук HP', '15.6", Core i5', (SELECT id FROM categories WHERE name = 'Ноутбуки'), '111111', 20000.00, 25000.00, 2.1, 'Ноутбуки'),
('iPhone 14', '128GB, Space Gray', (SELECT id FROM categories WHERE name = 'Смартфони'), '222222', 30000.00, 35000.00, 0.2, 'Смартфони'),
('Холодильник Samsung', '350L, No Frost', (SELECT id FROM categories WHERE name = 'Холодильники'), '333333', 15000.00, 20000.00, 50.0, 'Холодильники'),
('Монитор Dell', '24", Full HD', (SELECT id FROM categories WHERE name = 'Електроніка'), '444444', 5000.00, 7000.00, 3.5, 'Електроніка'),
('Пральна машина LG', '8кг, Inverter', (SELECT id FROM categories WHERE name = 'Побутова техніка'), '555555', 12000.00, 15000.00, 40.0, 'Побутова техніка');

-- Заповнення orders
INSERT INTO orders (client_id, total_amount, status, payment_method, warehouse_id) 
VALUES 
((SELECT id FROM users WHERE email = 'client1@test.com'), 25000.00, 'completed', 'card', (SELECT id FROM warehouses WHERE name = 'Склад А')),
((SELECT id FROM users WHERE email = 'client1@test.com'), 70000.00, 'pending', 'online', (SELECT id FROM warehouses WHERE name = 'Склад Б')),
((SELECT id FROM users WHERE email = 'client1@test.com'), 20000.00, 'confirmed', 'cash', (SELECT id FROM warehouses WHERE name = 'Склад В')),
((SELECT id FROM users WHERE email = 'client1@test.com'), 14000.00, 'canceled', 'card', (SELECT id FROM warehouses WHERE name = 'Склад Г')),
((SELECT id FROM users WHERE email = 'client1@test.com'), 30000.00, 'completed', 'online', (SELECT id FROM warehouses WHERE name = 'Склад Д'));

-- Заповнення order_items
INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
VALUES 
((SELECT id FROM orders LIMIT 1 OFFSET 0), (SELECT id FROM products LIMIT 1 OFFSET 0), 1, 25000.00),
((SELECT id FROM orders LIMIT 1 OFFSET 1), (SELECT id FROM products LIMIT 1 OFFSET 1), 2, 35000.00),
((SELECT id FROM orders LIMIT 1 OFFSET 2), (SELECT id FROM products LIMIT 1 OFFSET 2), 1, 20000.00),
((SELECT id FROM orders LIMIT 1 OFFSET 3), (SELECT id FROM products LIMIT 1 OFFSET 3), 2, 7000.00),
((SELECT id FROM orders LIMIT 1 OFFSET 4), (SELECT id FROM products LIMIT 1 OFFSET 4), 2, 15000.00);

-- Заповнення reviews
INSERT INTO reviews (user_id, product_id, order_id, rating, comment) 
VALUES 
((SELECT id FROM users WHERE email = 'client1@test.com'), (SELECT id FROM products LIMIT 1 OFFSET 0), (SELECT id FROM orders LIMIT 1 OFFSET 0), 5, 'Чудовий ноутбук!'),
((SELECT id FROM users WHERE email = 'client1@test.com'), (SELECT id FROM products LIMIT 1 OFFSET 1), (SELECT id FROM orders LIMIT 1 OFFSET 1), 4, 'Добре, але дорого'),
((SELECT id FROM users WHERE email = 'client1@test.com'), (SELECT id FROM products LIMIT 1 OFFSET 2), (SELECT id FROM orders LIMIT 1 OFFSET 2), 3, 'Середній холодильник'),
((SELECT id FROM users WHERE email = 'client1@test.com'), (SELECT id FROM products LIMIT 1 OFFSET 3), (SELECT id FROM orders LIMIT 1 OFFSET 3), 5, 'Ідеальний монітор'),
((SELECT id FROM users WHERE email = 'client1@test.com'), (SELECT id FROM products LIMIT 1 OFFSET 4), (SELECT id FROM orders LIMIT 1 OFFSET 4), 4, 'Працює тихо');

-- Заповнення discounts
INSERT INTO discounts (name, product_id, category_id, discount_type, value, start_date, end_date) 
VALUES 
('Знижка на ноутбуки', (SELECT id FROM products WHERE name = 'Ноутбук HP'), NULL, 'percentage', 10.00, '2024-01-01', '2024-12-31'),
('Акція на смартфони', (SELECT id FROM products WHERE name = 'iPhone 14'), NULL, 'fixed', 5000.00, '2024-02-01', '2024-02-28'),
('Розпродаж техніки', NULL, (SELECT id FROM categories WHERE name = 'Електроніка'), 'percentage', 15.00, '2024-03-01', '2024-03-31'),
('Знижка на монітори', (SELECT id FROM products WHERE name = 'Монитор Dell'), NULL, 'fixed', 1000.00, '2024-04-01', '2024-04-30'),
('Спецпропозиція', (SELECT id FROM products WHERE name = 'Пральна машина LG'), NULL, 'percentage', 20.00, '2024-05-01', '2024-05-31');

-- Заповнення suppliers
INSERT INTO suppliers (name, contact_person, phone, email) 
VALUES 
('TechSupplier Inc', 'Іван Петров', '+3806612345', 'tech@supplier.com'),
('ElectroParts Ltd', 'Олена Сидорова', '+3806723456', 'electro@parts.ua'),
('HomeTech Group', 'Марія Іванова', '+3806834567', 'home@tech.com'),
('GadgetWorld', 'Петро Михайлов', '+3806945678', 'gadget@world.ua'),
('SmartDevices Co', 'Анна Коваленко', '+3806056789', 'smart@devices.com');

-- Заповнення supply_orders
INSERT INTO supply_orders (supplier_id, status, expected_delivery_date) 
VALUES 
((SELECT id FROM suppliers LIMIT 1 OFFSET 0), 'delivered', '2024-01-15'),
((SELECT id FROM suppliers LIMIT 1 OFFSET 1), 'confirmed', '2024-02-20'),
((SELECT id FROM suppliers LIMIT 1 OFFSET 2), 'draft', '2024-03-25'),
((SELECT id FROM suppliers LIMIT 1 OFFSET 3), 'confirmed', '2024-04-10'),
((SELECT id FROM suppliers LIMIT 1 OFFSET 4), 'delivered', '2024-05-05');

-- Заповнення parking_spots
INSERT INTO parking_spots (warehouse_id, status, reserved_until) 
VALUES 
((SELECT id FROM warehouses LIMIT 1 OFFSET 0), 'available', NULL),
((SELECT id FROM warehouses LIMIT 1 OFFSET 1), 'reserved', '2024-12-31 15:00:00'),
((SELECT id FROM warehouses LIMIT 1 OFFSET 2), 'occupied', NULL),
((SELECT id FROM warehouses LIMIT 1 OFFSET 3), 'available', NULL),
((SELECT id FROM warehouses LIMIT 1 OFFSET 4), 'reserved', '2025-01-01 12:00:00');

-- Заповнення logs
INSERT INTO logs (user_id, action) 
VALUES 
((SELECT id FROM users LIMIT 1 OFFSET 0), 'Створено замовлення #1'),
((SELECT id FROM users LIMIT 1 OFFSET 1), 'Оновлено статус замовлення'),
((SELECT id FROM users LIMIT 1 OFFSET 2), 'Додано новий товар'),
((SELECT id FROM users LIMIT 1 OFFSET 3), 'Змінено ціну товару'),
((SELECT id FROM users LIMIT 1 OFFSET 4), 'Створено звіт');

-- Заповнення boxes
INSERT INTO boxes (name, description, length, width, height, max_weight) 
VALUES 
('Мала коробка', 'Для дрібної електроніки', 30.0, 20.0, 15.0, 5.0),
('Середня коробка', 'Універсальна коробка', 50.0, 35.0, 30.0, 15.0),
('Велика коробка', 'Для габаритної техніки', 70.0, 50.0, 40.0, 30.0),
('Коробка для техніки', 'З амортизацією для делікатної техніки', 100.0, 60.0, 50.0, 50.0),
('Спецкоробка', 'Промислова коробка підвищеної міцності', 120.0, 80.0, 60.0, 70.0);

-- Заповнення storage_zones
INSERT INTO storage_zones (warehouse_id, location_code, max_weight) 
VALUES 
((SELECT id FROM warehouses LIMIT 1 OFFSET 0), 'A-1', 1000.0),
((SELECT id FROM warehouses LIMIT 1 OFFSET 1), 'B-2', 1500.0),
((SELECT id FROM warehouses LIMIT 1 OFFSET 2), 'C-3', 2000.0),
((SELECT id FROM warehouses LIMIT 1 OFFSET 3), 'D-4', 2500.0),
((SELECT id FROM warehouses LIMIT 1 OFFSET 4), 'E-5', 3000.0);

-- Заповнення inventory_movements
INSERT INTO inventory_movements (product_id, from_zone_id, to_zone_id, quantity, movement_type, user_id, note) 
VALUES 
((SELECT id FROM products LIMIT 1 OFFSET 0), NULL, (SELECT id FROM storage_zones LIMIT 1 OFFSET 0), 10, 'incoming', (SELECT id FROM users LIMIT 1 OFFSET 1), 'Первинне надходження'),
((SELECT id FROM products LIMIT 1 OFFSET 1), (SELECT id FROM storage_zones LIMIT 1 OFFSET 0), (SELECT id FROM storage_zones LIMIT 1 OFFSET 1), 5, 'transfer', (SELECT id FROM users LIMIT 1 OFFSET 2), 'Переміщення між зонами'),
((SELECT id FROM products LIMIT 1 OFFSET 2), NULL, (SELECT id FROM storage_zones LIMIT 1 OFFSET 2), 3, 'incoming', (SELECT id FROM users LIMIT 1 OFFSET 1), 'Нова партія'),
((SELECT id FROM products LIMIT 1 OFFSET 3), (SELECT id FROM storage_zones LIMIT 1 OFFSET 2), NULL, 2, 'outgoing', (SELECT id FROM users LIMIT 1 OFFSET 3), 'Відвантаження клієнту'),
((SELECT id FROM products LIMIT 1 OFFSET 4), (SELECT id FROM storage_zones LIMIT 1 OFFSET 3), (SELECT id FROM storage_zones LIMIT 1 OFFSET 4), 4, 'transfer', (SELECT id FROM users LIMIT 1 OFFSET 4), 'Оптимізація сховища');

-- Заповнення batches
INSERT INTO batches (product_id, warehouse_id, quantity, expiration_date, received_at) 
VALUES 
((SELECT id FROM products WHERE name = 'Ноутбук HP'), (SELECT id FROM warehouses WHERE name = 'Склад А'), 100, '2025-12-31', now()),
((SELECT id FROM products WHERE name = 'iPhone 14'), (SELECT id FROM warehouses WHERE name = 'Склад Б'), 50, '2026-06-30', now()),
((SELECT id FROM products WHERE name = 'Холодильник Samsung'), (SELECT id FROM warehouses WHERE name = 'Склад В'), 30, NULL, now()),
((SELECT id FROM products WHERE name = 'Монитор Dell'), (SELECT id FROM warehouses WHERE name = 'Склад Г'), 20, '2027-01-01', now()),
((SELECT id FROM products WHERE name = 'Пральна машина LG'), (SELECT id FROM warehouses WHERE name = 'Склад Д'), 15, NULL, now());

INSERT INTO batch_locations (batch_id, storage_zone_id, box_id, quantity, created_at)
VALUES
((SELECT id FROM batches WHERE product_id = (SELECT id FROM products WHERE name = 'Ноутбук HP') LIMIT 1),
 (SELECT id FROM storage_zones WHERE location_code = 'A-1'),
 (SELECT id FROM boxes WHERE name = 'Середня коробка'),
 100, now());
INSERT INTO batch_locations (batch_id, storage_zone_id, box_id, quantity, created_at)
VALUES
((SELECT id FROM batches WHERE product_id = (SELECT id FROM products WHERE name = 'iPhone 14') LIMIT 1),
 (SELECT id FROM storage_zones WHERE location_code = 'B-2'),
 (SELECT id FROM boxes WHERE name = 'Мала коробка'),
 50, now());
INSERT INTO batch_locations (batch_id, storage_zone_id, box_id, quantity, created_at)
VALUES
((SELECT id FROM batches WHERE product_id = (SELECT id FROM products WHERE name = 'Холодильник Samsung') LIMIT 1),
 NULL, NULL, 30, now());
INSERT INTO batch_locations (batch_id, storage_zone_id, box_id, quantity, created_at)
VALUES
((SELECT id FROM batches WHERE product_id = (SELECT id FROM products WHERE name = 'Монитор Dell') LIMIT 1),
 (SELECT id FROM storage_zones WHERE location_code = 'D-4'),
 (SELECT id FROM boxes WHERE name = 'Коробка для техніки'),
 20, now());
INSERT INTO batch_locations (batch_id, storage_zone_id, box_id, quantity, created_at)
VALUES
((SELECT id FROM batches WHERE product_id = (SELECT id FROM products WHERE name = 'Пральна машина LG') LIMIT 1),
 NULL, NULL, 15, now());

-- Заповнення price_history
INSERT INTO price_history (product_id, old_price, new_price, changed_by) 
VALUES 
((SELECT id FROM products LIMIT 1 OFFSET 0), 24000.00, 25000.00, (SELECT id FROM users LIMIT 1 OFFSET 3)),
((SELECT id FROM products LIMIT 1 OFFSET 1), 34000.00, 35000.00, (SELECT id FROM users LIMIT 1 OFFSET 3)),
((SELECT id FROM products LIMIT 1 OFFSET 2), 19000.00, 20000.00, (SELECT id FROM users LIMIT 1 OFFSET 3)),
((SELECT id FROM products LIMIT 1 OFFSET 3), 6500.00, 7000.00, (SELECT id FROM users LIMIT 1 OFFSET 3)),
((SELECT id FROM products LIMIT 1 OFFSET 4), 14000.00, 15000.00, (SELECT id FROM users LIMIT 1 OFFSET 3));

INSERT INTO supply_order_items (supply_order_id, product_id, quantity, unit_price) 
VALUES
((SELECT id FROM supply_orders LIMIT 1 OFFSET 0), (SELECT id FROM products WHERE name = 'Ноутбук HP'), 20, 20000.00),
((SELECT id FROM supply_orders LIMIT 1 OFFSET 1), (SELECT id FROM products WHERE name = 'iPhone 14'), 30, 30000.00),
((SELECT id FROM supply_orders LIMIT 1 OFFSET 2), (SELECT id FROM products WHERE name = 'Холодильник Samsung'), 10, 15000.00),
((SELECT id FROM supply_orders LIMIT 1 OFFSET 3), (SELECT id FROM products WHERE name = 'Монитор Dell'), 25, 5000.00),
((SELECT id FROM supply_orders LIMIT 1 OFFSET 4), (SELECT id FROM products WHERE name = 'Пральна машина LG'), 15, 12000.00);

-- Заповнення tasks
INSERT INTO tasks (worker_id, order_item_id, supply_order_item_id, quantity, deadline, status, note) 
VALUES
((SELECT id FROM users WHERE email = 'worker1@test.com'), (SELECT id FROM order_items LIMIT 1 OFFSET 0), NULL, 1, '2025-05-10 14:00:00', 'pending', 'Підготувати ноутбук до відправки'),
((SELECT id FROM users WHERE email = 'worker1@test.com'), (SELECT id FROM order_items LIMIT 1 OFFSET 1), NULL, 2, '2024-02-25 16:30:00', 'in_progress', 'Комплектація замовлення смартфонів'),
((SELECT id FROM users WHERE email = 'worker1@test.com'), NULL, (SELECT id FROM supply_order_items LIMIT 1 OFFSET 2), 10, '2024-03-30 09:15:00', 'completed', 'Прийняти партію холодильників'),
((SELECT id FROM users WHERE email = 'worker1@test.com'), NULL, (SELECT id FROM supply_order_items LIMIT 1 OFFSET 3), 25, '2024-04-15 11:45:00', 'pending', 'Розвантаження моніторів'),
((SELECT id FROM users WHERE email = 'worker1@test.com'), NULL, (SELECT id FROM supply_order_items LIMIT 1 OFFSET 4), 15, '2024-05-10 13:20:00', 'in_progress', 'Перевірка пральних машин при прийомці');