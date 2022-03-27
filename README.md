# Projektor

## Running the application
1. Run docker compose in the solution directory:
    ```console
    docker-compose up --build -d
    ```
2. Run migrations for Movies and Identity services:
    - Using the package manager console:
      ```console
      Update-Database
      ```
    - Using dotnet cli (requires dotnet-ef):
      ```console
      dotnet ef database update
      ```
3. To stop the application run:
    ```console
    docker-compose down
    ```

## Services

### Movies

#### Seeding the database:
1. Start the container from the project root:
```console
docker-compose up --build -d projektor_mssql
```
2. Run this command:
```console
docker exec -it movies.db opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P MatfRs2_MSSQL -d MoviesDB -e -i /var/seed/seed_script.sql 
```