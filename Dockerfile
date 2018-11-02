FROM node:6

RUN npm install -g grunt-cli
RUN npm install -g bower
RUN apt-get update
RUN apt-get install -y ruby-full
RUN gem install sass --no-user-install

WORKDIR /usr/src/web
COPY . .
RUN ls -al
RUN npm install
RUN grunt

WORKDIR /usr/src/web/app
RUN npm install
RUN bower install --allow-root

RUN grunt build

WORKDIR /usr/src/web

RUN pwd
RUN ls -al node_modules