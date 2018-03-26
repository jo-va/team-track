FROM node:8.9.3-alpine

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Set a working directory
WORKDIR /usr/src/app

# Install Node.js dependencies
ADD ./package.json ./yarn.lock /tmp/
RUN set -ex; \
	if [ "$NODE_ENV" = "production" ]; then \
		cd /tmp && yarn install --no-cache --frozen-lockfile --production; \
	else \
		cd /tmp && yarn install; \
	fi;
RUN cd /usr/src/app && ln -s /tmp/node_modules

# Attempts to copy "build" folder even if it doesn't exist
COPY .env build* ./build/

CMD [ "node", "build/server.js" ]