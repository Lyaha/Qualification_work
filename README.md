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

#### Process Automation:
1. Automatic record modification timestamp updates
2. Real-time calculation of order totals
3. Reservation system for parking spots
4. Monitoring of weight in storage zones
5. Tracking of inventory movement

#### Security Triggers:
1. Role-based access control
2. Validation of storage weight limits
3. Product availability checks
4. Logging of price changes

#### Storage Optimization:
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



## Frontend Architecture

### Core Technologies
- **React 18**: Modern UI library with concurrent rendering support
- **TypeScript**: Static typing for enhanced code reliability
- **Chakra UI**: Component library with accessibility and customization focus
- **i18next**: Internationalization framework

### Key Features

#### 1. Components Architecture
- **Generic Components**:
  - `GenericTable`: Reusable table with sorting, filtering, and pagination
  - `GenericFormModal`: Universal form handling component
  - `GenericDetailView`: Standardized detail view layout
  - `Layout`: Consistent page structure with responsive design

#### 2. Page Organization
- **Module-based Structure**:
  - Products Management
  - Warehouse Operations
  - Order Processing
  - Inventory Management
  - User Administration

#### 3. State Management
- **Custom Hooks**:
  - `useVisibilityPolling`: Real-time data updates
  - `useCrudOperations`: Universal CRUD operations
  - `useFormHandler`: Form state and validation
  - `useModalNavigation`: Modal window control

#### 4. Authentication & Authorization
- **Auth0 Integration**:
  - Secure authentication flow
  - Role-based access control
  - Protected routes
  - Token management

#### 5. Data Flow
- **API Integration**:
  - Axios for HTTP requests
  - Request interceptors
  - Error handling
  - Response caching

#### 6. UI/UX Features
- **Responsive Design**:
  - Mobile-first approach
  - Adaptive layouts
  - Dynamic component rendering

- **Theme System**:
  - Light/Dark mode support
  - Custom color schemes
  - Consistent styling

- **Accessibility**:
  - ARIA attributes
  - Keyboard navigation
  - Screen reader support

#### 7. Performance Optimizations
- **Code Splitting**:
  - Lazy loading of routes
  - Dynamic imports
  - Component code splitting

- **Rendering Optimizations**:
  - Memo and useMemo usage
  - Virtual scrolling for large lists
  - Debounced search inputs

- **Asset Management**:
  - Optimized image loading
  - Font preloading
  - Resource prioritization

### Code Organization

```text
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── api/                # API integration
├── context/            # React context providers
├── utils/              # Helper functions
├── types/              # TypeScript definitions
├── i18n/               # Internationalization
└── theme/              # UI theming
```

### Development Practices
- **Code Quality**:
  - ESLint configuration
  - Prettier formatting
  - TypeScript strict mode
  - Unit testing with Jest

- **Git Workflow**:
  - Feature branch workflow
  - Pull request reviews
  - Conventional commits
  - Automated CI/CD

## Implementation Details

### Architecture Solutions

#### Microservices Architecture
The project is split into three main services:
- Staff Frontend (React + TypeScript)
- Backend API (NestJS)
- Database (PostgreSQL)

This separation provides:
- Independent scaling of components
- Isolation of business logic
- Better maintainability and testing
- Clear separation of concerns

#### Database Architecture
1. **ENUM Types for Status Management** (`init.sql:1-7`)
   - Ensures data integrity
   - Reduces storage requirements
   - Provides type safety at database level

2. **Trigger-based Automation** (`init.sql:294-584`)
   - Automatic weight calculations
   - Real-time inventory updates
   - Price history tracking
   - Parking spot management

### Implemented Algorithms

#### 1. Inventory Movement Processing (`init.sql:385-446`)
- **Purpose**: Handles product movements between storage zones
- **Features**:
  - Weight validation
  - Automatic batch creation
  - Storage zone capacity checking
  - Transaction safety

#### 2. Batch Management System (`batch.service.ts:12-68`)
- **Algorithm**: FIFO (First In, First Out)
- **Implementation**:
  - Tracks expiration dates
  - Manages inventory levels
  - Ensures proper rotation of stock

#### 3. Storage Zone Weight Management (`process_transfer():447-584`)
- **Features**:
  - Real-time weight calculations
  - Capacity validation
  - Automatic weight distribution
  - Error prevention

#### 4. Task Assignment System (`task.service.ts:64-157`)
- **Algorithm**: Priority-based assignment
- **Features**:
  - Worker availability checking
  - Deadline management
  - Workload balancing

### Data Structure Optimizations

#### 1. Indexing Strategy
- **Product-Warehouse Index** (`init.sql:280`)
  ```sql
  CREATE INDEX idx_batches_product_warehouse ON batches(product_id, warehouse_id);
  ```
  - Improves query performance for stock lookups
  - Optimizes inventory movement operations

#### 2. Table Relationships
- **Many-to-Many Relationships** (`init.sql:34-42`)
  ```sql
  CREATE TABLE user_warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    UNIQUE (user_id, warehouse_id)
  );
  ```
  - Efficient worker-warehouse assignments
  - Maintains data integrity
  - Enables flexible access control

### Security Implementations

#### 1. Role-Based Access Control (`check_warehouse_worker_role():585-598`)
- Validates user roles for warehouse operations
- Prevents unauthorized access
- Maintains security at database level

#### 2. Transaction Management (`task.service.ts:64-157`)
- Ensures data consistency
- Prevents partial updates
- Handles concurrent operations safely

### Frontend Optimizations

#### 1. Generic Table Component (`GenericTable.tsx:1-584`)
- Reusable table component
- Built-in sorting and filtering
- Pagination handling
- Optimized rendering

#### 2. Real-time Data Updates
- Polling mechanism (`useVisibilityPolling.ts`)
- Efficient state management
- Optimized re-rendering

### Performance Considerations

1. **Database Level**
- Efficient indexing strategy
- Materialized views for reports
- Trigger-based automation

2. **Application Level**
- Caching mechanisms
- Batch operations
- Optimized queries

3. **Frontend Level**
- Component lazy loading
- State management optimization
- Network request batching

## License

This software is licensed under a proprietary license. For details, please refer to the LICENSE file.
