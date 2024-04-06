FROM node:20 AS button

RUN apt-get update && apt-get dist-upgrade -y \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY button .

RUN npm install --only=production

CMD ["node", "index.js"]

FROM python:3.9.18 AS builder
WORKDIR /app

RUN pip install mkDocs \ 
  mdx-gh-links \
  mkdocs-callouts \
  mkdocs-click \
  mkdocs-macros-plugin \
  mkdocs-material \
  mkdocs-mermaid2-plugin 

COPY mkdocs.yml .
COPY docs docs

RUN mkdocs build


FROM nginx:1.25 AS www

WORKDIR /usr/share/nginx/html

COPY mkdocs.yml .
COPY docs .

COPY --from=builder /app/site .
