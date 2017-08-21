FROM node:8.4

ENV NPM_CONFIG_LOGLEVEL warn

ADD package.json yarn.lock /tmp/
RUN cd /tmp && yarn install
RUN mkdir -p /koa-mongo/api && cd /koa-mongo/api && ln -s /tmp/node_modules

WORKDIR /koa-mongo/api
COPY . .

EXPOSE 8080

CMD if [ ${NODE_ENV} = production ]; \
	then \
	npm start; \
	else \
	npm run dev; \
	fi
