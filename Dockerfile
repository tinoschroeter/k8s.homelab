FROM node:16.11.1-bullseye-slim AS button

RUN apt-get update && apt-get dist-upgrade -y \
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY button .

RUN npm install --only=production

CMD ["node", "index.js"]

FROM nginx:1.20.2 AS www
RUN apt-get update && apt-get dist-upgrade -y && \
apt-get install pandoc wget -y

WORKDIR /usr/share/nginx/html/
COPY www .
RUN sh build.sh
