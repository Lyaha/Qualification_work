# Qualification work
Qualification work on the topic "Architecture and algorithms of warehouse accounting software"

The goal of the project is to develop universal software for accounting for goods in one or more warehouses, with a focus on architectural scalability and algorithmic efficiency of basic operations such as accounting, movement, and storage optimization.

## Database Structure

### Core Entities

#### Users and Access Management
- **Users**: Stores information about users in the system with roles (client, warehouse_worker, manager, admin, director)
- **User Warehouses**: Links workers to warehouses (many-to-many)

#### Warehouse Management
- **Warehouses**: General information about each warehouse
- **Storage Zones**: Defined storage areas within a warehouse
- **Parking Spots**: Reserved parking areas for vehicles
- **Boxes**: Specifications and dimensions of storage boxes

#### Product Management
- **Products**:  Central product catalog
- **Categories**: Hierarchical category structure for organization
- **Batches**: Product batches for inventory tracking
- **Batch Locations**: Placement of product batches within the warehouse

#### Order Processing
- **Orders**: Customer order records
- **Order Items**: Items included in customer orders
- **Supply Orders**: Purchase orders for suppliers
- **Supply Order Items**: Items listed in supplier orders

### Supporting Entities
- **Reviews**: Product and order feedback from clients
- **Discounts**: Discount rules and logic
- **Price History**: Historical data on product pricing
- **Tasks**:  Assigned tasks for warehouse workers
- **Inventory Movements**: Tracking of item movement within the warehouse
- **Logs**: Audit logs of system activity and changes

### Key Features

#### Автоматизация процессов:
1. Automatic record modification timestamp updates
2. Real-time calculation of order totals
3. Reservation system for parking spots
4. Monitoring of weight in storage zones
5. Tracking of inventory movement

#### Триггеры безопасности:
1. Role-based access control
2. Validation of storage weight limits
3. Product availability checks
4. Logging of price changes

#### Оптимизация хранения:
1. Batch-based storage tracking
2. Logical warehouse zoning
3. Box usage management
4. Capacity and weight monitoring per zone

### Database Constraints
- UUID-based unique identifiers
- Foreign key relationships for data integrity
- Storage weight validations
- Status and type value constraints
- Date and time range validations



## License

This software is licensed under a proprietary license. For details, please refer to the LICENSE file.
