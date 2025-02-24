FROM node:18-alpine

WORKDIR /jecarate

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build  # This ensures the production build is created

EXPOSE 3000

CMD ["npm", "run", "start"]
