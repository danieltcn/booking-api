# Use the Node.js image bundled with Alpine OS, a lightweight Linux distro
FROM node:16-alpine

# Update the OS packages
RUN apk update

# Set the working directory
WORKDIR /usr/src

# Copy the project-related package setup
COPY ../package.json ./
COPY ../yarn.lock ./

# Install the dependencies
RUN yarn

# Copy the rest of the project files
COPY ../. .

# Expose the application and the debug port
EXPOSE 3000 8800

# Set the command that runs the application
ENTRYPOINT ["/bin/sh", "-c", "yarn && yarn dev"]
