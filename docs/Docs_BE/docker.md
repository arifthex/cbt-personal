🚀 Panduan Dasar Docker
Dokumentasi singkat untuk mengelola image dan container di Docker.

🔎 Cek Image & Container
Cek semua image yang ada
Code : docker images

Cek container yang sedang berjalan
Code : docker ps

Cek semua container (termasuk yang mati)
Code : docker ps -a

🗑️ Hapus Image & Container
Hapus container (harus stop dulu)
Code : docker stop <container_id_or_name>
Code : docker rm <container_id_or_name>

Hapus image
Code : docker rmi <image_id>

Hapus semua container & image yang tidak terpakai
Code : docker system prune -a

🏗️ Build & Run Container
Build image dari Dockerfile
Code : docker build -t nama-image:tag .

Contoh:
Code : docker build -t cbt-api:latest .

Jalankan container baru
Code : docker run -d --name nama-container -p 8080:8080 nama-image:tag

-d → jalan di background (detached).
--name → kasih nama biar mudah diingat.
-p → mapping port (host:container).

Contoh:

Code : docker run -d --name cbt-api -p 8080:8080 cbt-api:latest

⚡ Kelola Container yang Sudah Ada
Code : Start / Stop container
Code : docker start cbt-api
Code : docker stop cbt-api

Restart container
Code : docker restart cbt-api

Lihat log container
Code : docker logs -f cbt-api

🛠️ Perintah Penting Lain
Masuk ke dalam container (shell)
Code : docker exec -it cbt-api /bin/sh

atau

Code : docker exec -it cbt-api bash

Copy file dari/ke container
Code : docker cp <container_id>:/path/file.txt ./local_file.txt
Code : docker cp ./local_file.txt <container_id>:/path/file.txt

🛠️ Contoh Praktis

Satu container, port default

code : docker run -d --name cbt-api -p 8080:8080 cbt-api:latest

→ akses di http://server-ip:8080

Container kedua, beda host_port

code : docker run -d --name cbt-api-dev -p 8081:8080 cbt-api:latest

→ akses di http://server-ip:8081

Container ketiga lagi

code : docker run -d --name cbt-api-test -p 9000:8080 cbt-api:latest

→ akses di http://server-ip:9000

🔧 Kelola Banyak Container

Cek container aktif:
code : docker ps


Output misalnya:

CONTAINER ID   NAMES         PORTS
a1b2c3d4e5     cbt-api       0.0.0.0:8080->8080/tcp
f6g7h8i9j0     cbt-api-dev   0.0.0.0:8081->8080/tcp
k1l2m3n4o5     cbt-api-test  0.0.0.0:9000->8080/tcp


Jadi keliatan mappingnya:
cbt-api di 8080
cbt-api-dev di 8081
cbt-api-test di 9000

💡 Tips
Selalu beri nama container (--name) biar gampang dikelola.
Gunakan tag (:latest, :v1.0.0) supaya versi jelas.
Untuk development, bisa pakai docker compose agar service seperti API, DB, Redis lebih gampang diorkestrasi.