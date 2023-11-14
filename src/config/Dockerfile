FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
COPY ../../src ./src
CMD ["npm", "run", "prod"]