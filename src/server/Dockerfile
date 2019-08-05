# will use the context of NODE --version:10 (main cause of size on disk)
FROM node:10

ENV mode="test"
# replace /home/teneos/distriserver with your/path/to/app
RUN mkdir -p ./app/vino/node_modules && chown -R node:node ./app/vino
# redis stuff
RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    mv src/redis-server /usr/bin/ && \
    cd .. && \
    rm -r redis-stable && \
    npm install -g concurrently

# could use this sooner with a build-arg with my/path/to/app to have unique Dockerfile ?
WORKDIR ./app/vino

COPY package*.json ./
# name of the user who runs the cmd on the machine
USER node

RUN npm install
#copy of all files except .dockerignore (node_modules for example)
COPY --chown=node:node . .
#http
EXPOSE 3000
#redis
EXPOSE 6379

CMD concurrently "/usr/bin/redis-server --bind '0.0.0.0'" "sleep 5s; node app.js"
