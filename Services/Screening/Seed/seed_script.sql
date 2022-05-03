GO
CREATE VIEW movies_tmp AS
SELECT Id, Title, Length FROM Movies;

GO
DELETE FROM Movies;

GO
DBCC CHECKIDENT (Movies, RESEED, 0)

GO
BULK INSERT movies_tmp
FROM '/var/seed_screening/movies.csv'
WITH (FORMAT = 'CSV'
      , FIRSTROW=2
      , ROWTERMINATOR = '0x0a');

GO 
DROP VIEW movies_tmp;

GO
CREATE VIEW screenings_tmp AS
SELECT Id, MovieId, MovieStart, HallId FROM Screenings;

GO
DELETE FROM Screenings;

GO
DBCC CHECKIDENT (Screenings, RESEED, 0)

GO
BULK INSERT screenings_tmp
FROM '/var/seed_screening/screenings.csv'
WITH (FORMAT = 'CSV'
      , FIRSTROW=2
      , ROWTERMINATOR = '0x0a');

GO 
DROP VIEW screenings_tmp;