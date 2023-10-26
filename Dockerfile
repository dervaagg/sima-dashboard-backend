FROM node:lts as runner
WORKDIR /node-express
ENV APP_PORT 4000
ENV SESSION_SECRET 081317043646bhaskarogra
ENV POSTGRESQL_DB_URI postgres://muhammadbhaska0:UV1scOGo8gML@ep-dawn-lab-72295297.ap-southeast-1.aws.neon.tech/ppl
ENV ACCESS_TOKEN_SECRET rahasia123
ARG COMMIT_ID
ENV COMMIT_ID=${COMMIT_ID}
COPY . .
RUN rm -rf node_modules
RUN npm update
RUN npm install
RUN npm rebuild bcrypt --build-from-source
EXPOSE 4000
CMD ["node", "index.js"]