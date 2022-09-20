FROM node:current-alpine3.16

RUN apk add --no-cache git
RUN apk add --no-cache make
RUN npm install -g http-server


WORKDIR /app
RUN git clone https://github.com/Eisenbahnplatte/global-ld-browser-cs.git

WORKDIR /app/global-ld-browser-cs
RUN git checkout cs-global-ld-browser

RUN make install
RUN make build


EXPOSE 8080
CMD [ "http-server", "dist" ]