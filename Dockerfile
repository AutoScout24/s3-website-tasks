FROM node:9

LABEL maintainer="#AS24-ThatsClassified-ds@scout24.com"

WORKDIR home

RUN apt-get update && apt-get -y install git nasm

COPY ./package.json ./package-lock.json ./
RUN npm i
COPY ./src ./src

CMD ["npm", "test"]
