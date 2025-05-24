FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY ./go-signsafe-jwt/go.mod ./go-signsafe-jwt/go.sum ./
RUN go mod download

COPY ./go-signsafe-jwt .

RUN go build -o app .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/app .

EXPOSE 8001

CMD ["./app"]

