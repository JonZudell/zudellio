FROM alpine
WORKDIR /app

RUN apk update && apk add zip unzip
COPY ./start.sh ./start.sh
ADD https://c2.hak5.org/download/community /app/c2.zip
RUN unzip c2.zip -d /app
CMD ["./start.sh"]