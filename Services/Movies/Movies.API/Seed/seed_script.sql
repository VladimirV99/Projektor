GO
CREATE VIEW movies_tmp AS
SELECT Id, Title, Year, Length, ImdbUrl FROM Movies;

GO
DELETE FROM Movies;

GO
DBCC CHECKIDENT (Movies, RESEED, 0)

GO
BULK INSERT movies_tmp
FROM '/var/seed/movies.csv'
WITH (FORMAT = 'CSV'
      , FIRSTROW=2
      , ROWTERMINATOR = '0x0a');

GO 
DROP VIEW movies_tmp;

GO
DELETE FROM Genres;

GO
DBCC CHECKIDENT (Genres, RESEED, 0)

GO
BULK INSERT Genres
FROM '/var/seed/genres.csv'
WITH (FORMAT = 'CSV',
        DATAFILETYPE='char',
        FIRSTROW=2,
        ROWTERMINATOR='0x0a');   

GO
INSERT INTO Genres(Name) VALUES ('Other');

GO
DELETE FROM Roles;

GO
DBCC CHECKIDENT (Roles, RESEED, 0)

GO
BULK INSERT Roles
FROM '/var/seed/roles.csv'
WITH (FORMAT = 'CSV',
        DATAFILETYPE='char',
        FIRSTROW=2,
        ROWTERMINATOR='0x0a');

GO
DELETE FROM People;

GO
DBCC CHECKIDENT (People, RESEED, 0)

GO
CREATE VIEW people_tmp AS
SELECT Id, FirstName, LastName, ImdbUrl FROM People;

GO
BULK INSERT people_tmp
FROM '/var/seed/people.csv'
WITH (FORMAT = 'CSV',
        DATAFILETYPE='char',
        FIRSTROW=2,
        ROWTERMINATOR='0x0a');

GO 
DROP VIEW people_tmp;

GO
DELETE FROM GenreMovie;

GO
CREATE VIEW mgtmp AS
SELECT MoviesId, GenresId FROM GenreMovie;

GO
BULK INSERT mgtmp
FROM '/var/seed/movie_genres.csv'
WITH (FORMAT = 'CSV',
        DATAFILETYPE='char',
        FIRSTROW=2,
        ROWTERMINATOR='0x0a');

GO
DROP VIEW mgtmp;

GO
DELETE FROM MoviePeople;

GO
CREATE VIEW mptmp AS
SELECT PersonId, MovieId, RoleId FROM MoviePeople;

GO
BULK INSERT mptmp
FROM '/var/seed/movie_people.csv'
WITH (FORMAT = 'CSV',
        DATAFILETYPE='char',
        FIRSTROW=2,
        ROWTERMINATOR='0x0a');

GO
DROP VIEW mptmp;






