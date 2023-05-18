# FROM node:18-alpine

# RUN mkdir -p /usr/src/app

# WORKDIR /usr/src/app

# COPY . .

# RUN npm install

# EXPOSE 3000

# # Create a user with a known UID/GID within range 10000-20000.
# # This is required by Choreo to run the container as a non-root user.
# RUN adduser \
#     --disabled-password \
#     --gecos "" \
#     --home "/nonexistent" \
#     --shell "/sbin/nologin" \
#     --no-create-home \
#     --uid 10014 \
#     "choreo"
# # Use the above created unprivileged user
# USER 10014

# CMD ["npm", "run", "start"]

FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Create a new user with UID 10014
RUN addgroup -g 10014 choreo && \
    adduser  --disabled-password  --no-create-home --uid 10014 --ingroup choreo choreouser
# Set a non-root user
USER 10014

CMD [ "node", "appointments.js" ]