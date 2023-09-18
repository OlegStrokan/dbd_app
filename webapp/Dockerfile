# Use the official Node.js image with version 18 as a base image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy everything from the root directory to /app
COPY . /app

# Set the working directory to /app/channels
WORKDIR /app/channels

# Install npm packages from the package.json in /app/channels
RUN npm install

# Install npm packages globally
RUN npm install -g cross-env webpack

# Start the application with the run command
CMD ["npm", "run", "run"]
