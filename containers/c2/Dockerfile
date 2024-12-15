FROM alpine
WORKDIR /app

RUN apk update && apk add zip unzip python3 py3-pip jq && pip3 install awscli --break-system-packages
COPY ./start.sh /app/start.sh
ADD https://c2.hak5.org/download/community /app/c2.zip
RUN unzip c2.zip -d /app

CMD ["sh", "/app/start.sh"]