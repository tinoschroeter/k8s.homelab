FROM node:16.11.1-bullseye-slim AS button

RUN apt-get update && apt-get dist-upgrade -y \
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY button .

RUN npm install --only=production

CMD ["node", "index.js"]

FROM python:3.9.12 AS builder
WORKDIR /app

RUN pip install mkDocs
RUN pip install mkdocs-mermaid2-plugin

COPY mkdocs.yml .
COPY docs docs

RUN mkdocs build


FROM nginx:1.20.2 AS www

WORKDIR /usr/share/nginx/html

COPY mkdocs.yml .
COPY docs .

COPY --from=builder /app/site .
