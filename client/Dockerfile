# Use the official Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY src/ ./src/

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "src/app.js"]
