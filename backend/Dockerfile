FROM node:14-alpine
COPY ./dist ./dist/
COPY ./package.json ./package.json

ENTRYPOINT ["yarn"]
CMD ["start"]