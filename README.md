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
   (*Note: Migrations can fail to apply automatically if the database takes too long to initialize. In that case, restart the services that failed to apply migrations*)
2. (Optional) Insert dummy data into database by running the seeder tool:
   ```
   cd Tools/Seeder
   dotnet run seed --all
   ```
3. Start the client:
   ```
   cd app
   npm install
   npm run start:dev
   ```
4. To stop the application run:
   ```
   docker-compose down
   ```

## Services

### Identity

![Identity Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Identity/main?style=for-the-badge)

Identity server handles user and role management. Authentication is done using JWT and refresh tokens, while authorization is done using roles. Supported roles are `Administrator` and `Customer`.

When the service starts, an administrator account is created using the credentials specified in the "Admin" section of the configuration file.
For the development environment the default credentials are `admin@admin.com`/`Admin_123`.
This account cannot be deleted as it will be recreated when the service restarts, so for better security the password should be changed after the first login.

### Movies

![Movies.API Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Movies.API/main?style=for-the-badge&label=Build%20API)
![Movies.GRPC Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Movies.GRPC/main?style=for-the-badge&label=Build%20GRPC)

Movies service manages the movies themselves. It is the primary owner of the movie entity along with genres, people and roles.
It exposes endpoints for basic CRUD operations, filtering and searching which are mainly used on the Browse Movies section of the website.

It is used by other services via its gRPC interface to get info about a specific movie.

### Screening

![Screening.API Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Screening.API/main?style=for-the-badge&label=Build%20API)
![Screening.GRPC Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Screening.GRPC/main?style=for-the-badge&label=Build%20GRPC)

Screening service manages movie screenings. Screenings can be created, deleted or updated.
These operations are used mainly on admin dashboard and movie screen.
A screening consists of a movie and hall object and moment when projection starts.

This service synchronously communicates with movie and reservation services to check if they can update or delete certain objects (movies, halls).

### Reservation

![Reservation Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Reservation/main?style=for-the-badge)

Reservation service is responsible for managing screening halls and customer reservations.

Halls are rooms in which screenings are held. They are described by a name, number of rows and number of columns. 
The seats are arranged in a grid and defined by their row and column.

A customer can reserve any available seat for a movie screening, or cancel a previously made reservation thereby freeing those seats again.
In both cases, they will be notified of the action by email.

When a screening is canceled or rescheduled, this service finds all customers this change affects and notifies them using the mailer service.

### Review

![Review Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Review/main?style=for-the-badge)

Review service manages movie reviews that can be created by users after watching a movie.
A review consists of a short summary, a body and a numeric score (0-10).
Users can add a review only after the screening for which they purchased a ticket ends.

To determine if a customer has watched the movie, this service is asynchronously notified by the reservation service when a customer purchases or cancels a ticket.

### Mailer

![Mailer Workflow Status](https://img.shields.io/github/workflow/status/VladimirV99/Projektor/Mailer/main?style=for-the-badge)

Mailer is used by other services to send notification emails to customers. It receives requests from the event bus on the `mail-queue` channel. The account from which the email is sent should be set in the "Email" section of the configuration file.

## Tools

### Seeder

Seeder is a debug tool that makes data management easier. It can be used to fill the databases with dummy data, clear them, or drop the databases altogether.

## Authors
- [Vladimir Vuksanović, 1006/2021](https://github.com/VladimirV99)
- [Aleksa Kojadinović, 1021/2021](https://github.com/aleksakojadinovic)
- [Lazar Čeliković, 1063/2021](https://github.com/Hos1g4k1)

## License
Copyright (c) CheKoV. All rights reserved.

Licensed under the [MIT](https://github.com/VladimirV99/Projektor/blob/main/LICENSE) license.
