FROM koalaman/shellcheck-alpine:v0.8.0 as verify-sh
WORKDIR /src
COPY ./*.sh ./
RUN shellcheck -e SC1091,SC1090 ./*.sh

FROM node:19.0.0 AS restore
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM restore AS verify-format
ENV CI=true
RUN yarn verify-format

FROM restore AS test
ENV CI=true
RUN yarn test
