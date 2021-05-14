FROM node:16-alpine AS dev
RUN mkdir /home/node/code
WORKDIR /home/node/code
CMD ["yarn", "dev"]
