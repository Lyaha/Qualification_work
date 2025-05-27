import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Warehouse Management System API')
    .setDescription(
      `
      Complete REST API documentation for Warehouse Management System.
      
      ## Features
      - User Management
      - Warehouse Operations
      - Inventory Control
      - Order Processing
      - Task Management
      
      ## Authentication
      Uses JWT Bearer token authentication.
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Warehouses', 'Warehouse management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Orders', 'Order processing endpoints')
    .addTag('Tasks', 'Task management endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Reports', 'Reporting endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(8001);
}
bootstrap();
