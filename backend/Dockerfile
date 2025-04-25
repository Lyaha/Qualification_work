# 1. Базовий образ
FROM node:18-alpine

# 2. Директорія додатку
WORKDIR /app

# 3. Встановлення залежностей
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli
# 4. Копіюємо весь код
COPY . .

# 5. Збірка TypeScript → JavaScript
RUN npm run build

# 6. Запуск
CMD ["node", "dist/main"]
