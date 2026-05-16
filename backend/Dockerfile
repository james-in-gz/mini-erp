# ---- Build stage ----
FROM golang:1.26 AS builder

WORKDIR /app
COPY . .

RUN go mod tidy
RUN go build -o app ./cmd/server

# ---- Run stage ----
FROM debian:bookworm-slim

WORKDIR /app

# ✅ 关键：安装 CA 证书
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

COPY --from=builder /app/app .

EXPOSE 8080

CMD ["./app"]