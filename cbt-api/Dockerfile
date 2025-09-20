FROM golang:1.21-alpine

# Install dependencies untuk go mod
RUN apk add --no-cache git bash ca-certificates

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy    # <-- ganti go mod download dengan tidy lebih aman

COPY . .

RUN go build -o cbt-api ./cmd/server

EXPOSE 8080

CMD ["./cbt-api"]
