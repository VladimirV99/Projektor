# Projektor

![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white)
![License](https://img.shields.io/github/license/VladimirV99/Projektor?style=for-the-badge)

Projektor is a microservice application for managing basic cinema operations. It supports managing movies, organizing screenings, reserving tickets and user reviews for previously watched movies.

## Required software
- .NET 6
- Docker
- Node.js

## Running the application
1. Run docker compose in the solution directory:
   ```
   docker-compose up --build -d
   ```
2. Run migrations for Movie and Identity services:
   ```
   // Using package manager console:
   Update-Database
   
   // Using dotnet cli (requires dotnet-ef):
   dotnet ef database update
   ```
3. (Optional) Insert dummy data into database by running the seeder tool:
   ```
   cd Tools/Seeder
   dotnet run
   ```
4. Start the client:
   ```
   cd app
   npm install
   npm run start:dev
   ```
5. To stop the application run:
   ```
   docker-compose down
   ```

## Services

### Identity

![Identity Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Identity/main?style=for-the-badge)

Identity server handles user and role managment. Authentication is done using JWT and refresh tokens, while authorization is done using roles. Supported roles are `Administrator` and `Customer`.

When the service starts, an administrator account is created using the credentials specified in "Admin" section of the configuration file. For the development environment the default credentials are `admin@admin.com`/`Admin_123`. This account cannot be deleted as it will be recreated when the service restarts, so for better security the password should be changed on first login.

### Movies.API

![Movies.API Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Movies.API/main?style=for-the-badge)

#### Seeding the database:
1. Start the database container from the project root:
   ```
   docker-compose up --build -d projektor_mssql
   ```
2. Execute the seed sql script:
   ```
   docker exec -it projektor_mssql opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P MatfRs2_MSSQL -d MoviesDB -e -i /var/seed/seed_script.sql 
   ```

### Mailer

![Mailer Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Mailer/main?style=for-the-badge)

Mailer is used by other services to send notification emails. It receives requests from the event bus on the `mail-queue` channel. The account from which the email is sent should be set in the "Email" section of the configuration file.

## Authors
- [Vladimir Vuksanović, 1006/2021](https://github.com/VladimirV99)
- [Aleksa Kojadinović, 1021/2021](https://github.com/aleksakojadinovic)
- [Lazar Čeliković, 1063/2021](https://github.com/Hos1g4k1)

## License
Copyright (c) CheKoV. All rights reserved.

Licensed under the [MIT](https://github.com/VladimirV99/Projektor/blob/main/LICENSE) license.