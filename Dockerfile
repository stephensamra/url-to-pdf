FROM node:18-alpine

ENV NODE_ENV=production
# Tells Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app

# It's important to copy the .puppeteerrc.cjs file before running yarn install as it will be used to configure the location of the .cache directory.
COPY package.json yarn.lock .puppeteerrc.cjs .

RUN yarn install --frozen-lockfile --non-interactive --production --silent --no-progress --no-emoji

COPY . .

EXPOSE 5555

USER node

CMD ["yarn", "start"]
