import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import {
  Batch,
  CompleteTaskDto,
  InventoryMovement,
  MovementType,
  Order,
  OrderItem,
  SupplyOrder,
  SupplyOrderItem,
  Task,
  User,
  UserWarehouse,
} from '../entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    @InjectRepository(InventoryMovement)
    private movementRepository: Repository<InventoryMovement>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(SupplyOrderItem)
    private supplyOrderItemRepository: Repository<SupplyOrderItem>,
    @InjectRepository(UserWarehouse)
    private userWarehouseRepository: Repository<UserWarehouse>,
  ) {}

  async create(createTaskDto: Partial<Task>): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(newTask);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    const Task = await this.taskRepository.findOne({ where: { id } });
    if (!Task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return Task;
  }

  async update(id: string, updateTaskDto: Partial<Task>): Promise<Task> {
    const Task = await this.findOne(id);
    const updatedTask = this.taskRepository.merge(Task, updateTaskDto);
    return this.taskRepository.save(updatedTask);
  }

  async remove(id: string): Promise<void> {
    const Task = await this.findOne(id);
    await this.taskRepository.remove(Task);
  }

  async findByField(field: keyof Task, value: any): Promise<Task[]> {
    return this.taskRepository.find({
      where: { [field]: value },
      relations: [
        'order_item',
        'order_item.order',
        'supply_order_item',
        'supply_order_item.supply_order',
      ],
    });
  }

  async completeTask(id: string, dto: CompleteTaskDto, user: User): Promise<Task> {
    return this.taskRepository.manager.transaction(async (manager) => {
      // 1. Загружаем задачу с нужными отношениями
      const task = await manager.findOne(Task, {
        where: { id },
        relations: [
          'order_item.order', // Явно загружаем связанный заказ
          'supply_order_item.supply_order', // И связанную заявку на поставку
        ],
      });

      if (!task) throw new NotFoundException('Task not found');

      // 2. Получаем warehouse_id с проверкой на null
      let warehouseId: string;

      if (task.order_item?.order) {
        warehouseId = task.order_item.order.warehouse_id;
      } else if (task.supply_order_item?.supply_order) {
        warehouseId = task.supply_order_item.supply_order.warehouse_id;
      } else {
        throw new BadRequestException('Cannot determine warehouse');
      }

      // 3. Проверка прав менеджера
      if (user.role === 'manager') {
        const hasAccess = await manager.exists(UserWarehouse, {
          where: {
            user_id: user.id,
            warehouse_id: warehouseId,
          },
        });

        if (!hasAccess) throw new ForbiddenException();
      }

      // 4. Работа с партией
      const batch = await manager.findOne(Batch, {
        where: { id: dto.batchId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!batch || batch.current_quantity < dto.quantity) {
        throw new BadRequestException('Invalid batch quantity');
      }

      batch.current_quantity -= dto.quantity;
      await manager.save(batch);

      // 5. Создаем перемещение
      const movement = manager.create(InventoryMovement, {
        product_id: batch.product_id,
        quantity: dto.quantity,
        movement_type: 'outgoing' as MovementType,
        user_id: dto.workerId || user.id,
        reference_id: task.id,
      });

      await manager.save(movement);

      // 6. Обновляем задачу
      task.status = 'completed';
      task.completed_at = new Date();
      task.worker_id = dto.workerId || user.id;

      return manager.save(task);
    });
  }

  async getBatchesForTask(taskId: string, user: User): Promise<Batch[]> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['order_item', 'supply_order_item'],
    });

    if (!task) throw new NotFoundException('Task not found');

    // Получаем product_id и warehouse_id
    let productId: string, warehouseId: string;

    if (task.order_item) {
      const orderItem = await this.orderItemRepository.findOne({
        where: { id: task.order_item.id },
        relations: ['order'],
      });
      if (!orderItem?.order) throw new NotFoundException('Order not found');
      productId = orderItem.product_id;
      warehouseId = orderItem.order.warehouse_id;
    } else if (task.supply_order_item) {
      const supplyOrderItem = await this.supplyOrderItemRepository.findOne({
        where: { id: task.supply_order_item.id },
        relations: ['supply_order'],
      });
      if (!supplyOrderItem?.supply_order) throw new NotFoundException('Supply order not found');
      productId = supplyOrderItem.product_id;
      warehouseId = supplyOrderItem.supply_order.warehouse_id;
    } else {
      throw new BadRequestException('Invalid task type');
    }
    // Проверка прав доступа
    if (user.role === 'manager') {
      const hasAccess = await this.userWarehouseRepository.exist({
        where: { user_id: user.id, warehouse_id: warehouseId },
      });
      if (!hasAccess) throw new ForbiddenException();
    }

    return this.batchRepository.find({
      where: {
        product_id: productId,
        warehouse_id: warehouseId,
        current_quantity: MoreThan(0),
      },
      order: { received_at: 'ASC' },
    });
  }
}
