# Use a Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the project
RUN npm run build

# Expose the application port (NestJS default is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
