# This is a 2 stage containerization process
# In the first stage we are using the client folder and creating a build which can be hosted using our server

# Use the official Node.js image as the base image for client app
FROM node:hydrogen-slim AS build

# Set the working directory
WORKDIR /opt/app

# Copy package.json and package-lock.json from client folder
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the client application code
COPY . .

# Build the client application, This will create custom-html-element.js file that our server application will host
RUN npm run build

# Expose the port for the server application
EXPOSE 8080

# Start the server application
CMD ["npm", "start"]