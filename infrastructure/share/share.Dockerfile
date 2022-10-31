FROM node:16-alpine3.12

RUN apk update
RUN apk add nginx git

WORKDIR /app
COPY package.json yarn.lock ./
COPY .npmrc /app/.npmrc

RUN yarn
COPY . /app
COPY ./infrastructure/share/share.env /app/.env
RUN yarn build

RUN mkdir -p /run/nginx
COPY ./infrastructure/share/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
