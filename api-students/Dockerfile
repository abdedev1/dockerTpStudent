ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION}-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Run the application as a non-root user.
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 9000

# Run the application.
CMD ["node", "server.js"]
