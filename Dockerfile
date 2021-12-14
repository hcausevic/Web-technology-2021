FROM node:14

# Create app directory
WORKDIR /app

# Copy app deps
COPY package*.json ./

# Install app deps
RUN npm install
# Bundle app source
COPY . .

EXPOSE 3000
ENTRYPOINT ["npm", "run", "start-dev"]
