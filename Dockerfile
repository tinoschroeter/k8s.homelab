FROM node:16.11.1-bullseye-slim AS button

RUN apt-get update && apt-get dist-upgrade -y \
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY button .

RUN npm install --only=production

CMD ["node", "index.js"]
