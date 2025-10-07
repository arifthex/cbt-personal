Migrations
1. docker exec -i [cbt_pg] #user_db psql -U cbtuser -d cbtdb < [migrations/002_new_table.sql] #nama_migration

2. Jalnkan openapi 
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i /local/oas-cbt.yaml \
  -g go-gin-server \
  -o /local/cbt-api-server
