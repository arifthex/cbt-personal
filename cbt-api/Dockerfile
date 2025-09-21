# Stage 1: build
FROM golang:1.23 AS builder

WORKDIR /app

# copy go.mod dan go.sum dulu
COPY go.mod go.sum ./
RUN go mod download

# copy source code
COPY . .

# pastikan go.sum up-to-date di container
RUN go mod tidy

# build binary
RUN go build -o /cbt-api ./cmd/main.go

# Stage 2: runtime
FROM alpine:latest

WORKDIR /app
COPY --from=builder /cbt-api .

EXPOSE 8080
CMD ["./cbt-api"]
