docker exec -it movies.db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'MatfRs2_Movies' -d MoviesDB -i /var/seed/seed_script.sql
