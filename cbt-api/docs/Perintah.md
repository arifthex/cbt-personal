docker ps
Docker & CBT API Commands (Advanced)
1. Cek Container dan Status
docker ps
docker ps -a


docker ps → container aktif

docker ps -a → semua container termasuk yang berhenti

2. Build & Run Docker Compose
docker compose up --build
docker compose up -d --build   # jalankan di background


Gunakan --build jika ada perubahan di Go code atau Dockerfile

Gunakan -d untuk detached mode

3. Stop & Remove Container
docker compose down
docker compose down -v   # hapus volume juga

4. Cek Log
docker compose logs -f api       # log API
docker compose logs -f postgres  # log PostgreSQL
docker compose logs -f redis     # log Redis
docker compose logs -f           # semua log

5. Masuk ke Container untuk Debug
docker exec -it cbt_api /bin/sh
docker exec -it cbt_pg /bin/sh
docker exec -it cbt_redis /bin/sh


Dari dalam container bisa cek file, run migration, test DB/Redis

6. Manajemen Database PostgreSQL
6.1 Masuk ke PostgreSQL Container
docker exec -it cbt_pg psql -U cbtuser -d cbtdb

6.2 Jalankan Migrations SQL

Misal file migrations di /app/migrations/001_init.sql di container api:

docker exec -i cbt_pg psql -U cbtuser -d cbtdb < migrations/001_init.sql


Alternatif: gunakan tool migration seperti golang-migrate untuk Go project

6.3 Cek Table
\dt
SELECT * FROM users;

7. Cek Redis
7.1 Masuk Redis CLI
docker exec -it cbt_redis redis-cli

7.2 Tes koneksi
PING


Output:

PONG


Simpan key contoh:

SET testkey "Hello CBT"
GET testkey

8. Test API Endpoint
8.1 Health Check
curl http://localhost:8080/health


Output:

CBT API is running

8.2 User CRUD (Contoh nanti dibuat)
# List user
curl http://localhost:8080/api/v1/users

# Create user
curl -X POST http://localhost:8080/api/v1/users \
-H "Content-Type: application/json" \
-d '{"name":"Budi","email":"budi@mail.com","password":"123456","role":"student"}'

9. Debugging Port Conflicts

Cek port di VPS:

sudo lsof -i :5432   # PostgreSQL
sudo lsof -i :6379   # Redis


Ganti port di docker-compose.yml jika conflict:

ports:
  - "5433:5432"  # host:container PostgreSQL
  - "6380:6379"  # host:container Redis


Update environment di api sesuai host port baru

10. Clean Up Docker
docker container prune   # hapus container berhenti
docker image prune -a    # hapus image tidak terpakai
docker volume prune      # hapus volume tidak terpakai
