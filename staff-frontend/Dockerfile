# Stage 1: Build the React application
FROM node:22-alpine as build

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY tsconfig.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.28-alpine

# Копируем конфигурацию Nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/.env /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]