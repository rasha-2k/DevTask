# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o devtask main.go

# Run stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/devtask .
EXPOSE 8080
CMD ["./devtask"]
