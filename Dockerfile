FROM bloben/electron-builder:latest

COPY . ./

RUN npm i

RUN npm run build

COPY ./package.json ./build

RUN ls -la

COPY --from=bloben/calendar:development ./usr/app/electron/ ./build/src/calendar/
COPY --from=bloben/api:development ./usr/app/electron/ ./build/src/api/

WORKDIR /build

RUN npm run electron:linux

RUN npm run electron:win
