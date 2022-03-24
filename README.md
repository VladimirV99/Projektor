# Projektor

### Movies Service

#### Seeding the database:
1. Start the container from the project root:
```console
docker-compose up --build -d movies.db
```
2. Run this command:
```console
docker exec -it movies.db opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P MatfRs2_Movies -d MoviesDB -e -i /var/seed/seed_script.sql 
```