FROM node:16-buster AS build

WORKDIR /build
COPY package*.json ./
RUN sed -i 's/\*\*\* CENSORED \*\*\*/CTF{Th1s_Is_y0oo00o0o000our_fl4g!}/' app.js
RUN npm install

FROM node:16-buster-slim
COPY --from=krallin/ubuntu-tini /usr/bin/tini /tini
ENTRYPOINT ["/tini", "--"]

WORKDIR /app
COPY --from=build /build/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
