FROM alpine
WORKDIR /app

RUN apk update && apk add zip unzip
ADD https://c2.hak5.org/download/community /app/c2.zip
RUN unzip c2.zip && rm /app/c2.zip

CMD ["./start.sh"]