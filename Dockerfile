# This is a 2 stage containerization process
# In the first stage we are using the client folder and creating a build which can be hosted using our server

# Use the official Node.js image as the base image for client app
FROM node:hydrogen-slim AS build

# Set the working directory
WORKDIR /opt/app

# Copy package.json and package-lock.json from client folder
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the client application code
COPY client/. .

# Build the client application, This will create custom-html-element.js file that our server application will host
RUN npm run build

# Build the server-side application
FROM node:hydrogen-slim AS prod

# Set the working directory
WORKDIR /opt/app

# Copy package.json and package-lock.json from the server folder
COPY server/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the server application code
COPY server/. .

# Copy the custom-html-element.js file from the previous container stage into public folder
# This will allow server application to host the file
COPY --from=build /opt/app/dist/. ./public

# Expose the port for the server application
EXPOSE 8080

# Create a non root user for running server application, As a non-root user this provides additional security to application
RUN useradd -m -u 2000 appuser

# Transfer the ownership of code files to newly created user
RUN chown -R appuser /opt/app

# Change to the newly created user
USER appuser

# Start the server application
CMD ["npm", "start"]