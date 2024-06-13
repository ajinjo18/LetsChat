FROM node:alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install mongoose --save

# Copy the rest of the application code
COPY . .

EXPOSE 3001

# Start the application
CMD ["npm", "start"]
