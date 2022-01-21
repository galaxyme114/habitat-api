FROM keymetrics/pm2:12-alpine

WORKDIR /api
COPY package.json yarn.lock /api/
RUN yarn install --pure-lockfile

COPY . /api/

#RUN ls -lasR /api

CMD ["pm2-runtime", "start", "ecosystem.config.json"]

EXPOSE 8080
