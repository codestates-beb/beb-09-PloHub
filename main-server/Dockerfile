FROM golang:1.20.4-alpine3.17 AS builder

RUN mkdir /app

WORKDIR /app

COPY . .

RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ./main-server ./cmd

FROM alpine:3.17.3

RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone \
    apk del tzdata

RUN mkdir /app

COPY --from=builder /app/main-server /app

WORKDIR /app

CMD ["./main-server", "-p", "4000"]