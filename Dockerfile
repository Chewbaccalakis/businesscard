FROM node:23-alpine

WORKDIR /app/

COPY . /app/

RUN npm install

RUN npm run build

CMD ["npm", "start"]
