FROM node:14-alpine
RUN npm install
WORKDIR /app
COPY . .
CMD ["node", "app.js"]