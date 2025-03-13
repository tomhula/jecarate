FROM node:18-alpine

WORKDIR /jecarate

# Install dependencies required for node-gyp (Python, make, g++, etc.)
RUN apk add --no-cache python3 make g++ 

# Install pnpm explicitly
RUN npm install -g pnpm

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build  # This ensures the production build is created

EXPOSE 3000

CMD ["npm", "run", "start"]
