FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY package-lock.json .
COPY package.json .
RUN npm ci

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

COPY ../../src ./src
CMD ["npm", "run", "prod"]

FROM nginx
COPY --from=builder /usr/src/app /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]