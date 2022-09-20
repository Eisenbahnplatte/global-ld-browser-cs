FROM node:current-alpine3.16

WORKDIR /app
RUN apk add --no-cache git
RUN git clone https://github.com/Eisenbahnplatte/global-ld-browser-cs.git

WORKDIR /app/global-ld-browser-cs
RUN git checkout cs-global-ld-browser
RUN pwd
RUN find

RUN apk add --no-cache make
RUN make install
RUN make build


RUN npm install -g http-server
EXPOSE 8080

CMD [ "http-server", "dist" ]