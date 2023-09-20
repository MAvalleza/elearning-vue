# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code to /app
COPY . .

# Build your Vite Vue app
RUN yarn build

# Expose the port your app will run on
EXPOSE 5173

# Define the command to run your app
CMD ["yarn", "start"]
