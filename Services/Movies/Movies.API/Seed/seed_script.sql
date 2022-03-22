GO
CREATE VIEW movies_tmp AS
SELECT Id, Title, Year, Length, ImdbUrl FROM Movies;

GO
DELETE FROM Movies;

GO
BULK INSERT movies_tmp
FROM '/var/seed/movies.csv'
WITH (FORMAT = 'CSV'
      , FIRSTROW=2
      , ROWTERMINATOR = '0x0a');

GO 
DROP VIEW movies_tmp;




