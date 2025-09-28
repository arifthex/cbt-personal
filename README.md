# cbt-personal

1. Build Image
docker build -t cbt-api .
a. -t cbt-api → kasih nama image cbt-api.
b. . → context build di folder sekarang.

2. Run container
docker run -d -p 8080:8080 --name cbt-api-container cbt-api
a. -d → jalanin di background.
b. -p 8080:8080 → mapping port host 8080 ke container 8080.
c. --name cbt-api-container → biar gampang dipanggil.

3. Cek container jalan
docker ps -a

4. 

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
