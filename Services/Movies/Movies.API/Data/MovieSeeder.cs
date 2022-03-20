using Movies.API.Entities;

namespace Movies.API.Data;

public class MovieSeeder : IMovieSeeder
{
    public async void SeedData(MovieContext context)
    {
        var movies = context.Movies;
        var people = context.People;

        if (!movies.Any())
        {
            await movies.AddRangeAsync(getMovies());
        }

        if (!people.Any())
        {
            await people.AddRangeAsync(getPeople());
        }

        context.SaveChanges();
    }

    public static IEnumerable<Movie> getMovies()
    {
        return new List<Movie>
        {
            new Movie()
            {
                Title = "Avatar", Length = 178, Year = 2009,
                ImdbUrl = "http://www.imdb.com/title/tt0499549/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Pirates of the Caribbean: At World's End", Length = 169, Year = 2007,
                ImdbUrl = "http://www.imdb.com/title/tt0449088/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Spectre", Length = 148, Year = 2015,
                ImdbUrl = "http://www.imdb.com/title/tt2379713/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "The Dark Knight Rises", Length = 164, Year = 2012,
                ImdbUrl = "http://www.imdb.com/title/tt1345836/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Star Wars: Episode VII - The Force Awakens", Length = 0, Year = 0,
                ImdbUrl = "http://www.imdb.com/title/tt5289954/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "John Carter", Length = 132, Year = 2012,
                ImdbUrl = "http://www.imdb.com/title/tt0401729/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Spider-Man 3", Length = 156, Year = 2007,
                ImdbUrl = "http://www.imdb.com/title/tt0413300/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Tangled", Length = 100, Year = 2010,
                ImdbUrl = "http://www.imdb.com/title/tt0398286/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Avengers: Age of Ultron", Length = 141, Year = 2015,
                ImdbUrl = "http://www.imdb.com/title/tt2395427/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Harry Potter and the Half-Blood Prince", Length = 153, Year = 2009,
                ImdbUrl = "http://www.imdb.com/title/tt0417741/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Batman v Superman: Dawn of Justice", Length = 183, Year = 2016,
                ImdbUrl = "http://www.imdb.com/title/tt2975590/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Superman Returns", Length = 169, Year = 2006,
                ImdbUrl = "http://www.imdb.com/title/tt0348150/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Quantum of Solace", Length = 106, Year = 2008,
                ImdbUrl = "http://www.imdb.com/title/tt0830515/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Pirates of the Caribbean: Dead Man's Chest", Length = 151, Year = 2006,
                ImdbUrl = "http://www.imdb.com/title/tt0383574/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "The Lone Ranger", Length = 150, Year = 2013,
                ImdbUrl = "http://www.imdb.com/title/tt1210819/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "Man of Steel", Length = 143, Year = 2013,
                ImdbUrl = "http://www.imdb.com/title/tt0770828/?ref_=fn_tt_tt_1"
            },
            new Movie()
            {
                Title = "The Chronicles of Narnia: Prince Caspian", Length = 150, Year = 2008,
                ImdbUrl = "http://www.imdb.com/title/tt0499448/?ref_=fn_tt_tt_1"
            }
        };
    }

    public static IEnumerable<Person> getPeople()
    {
        return new List<Person>
        {
            new Person()
            {
                FirstName = "50", LastName = "Cent", ImageUrl = null
            },
            new Person()
            {
                FirstName = "A.J.", LastName = "Buckley", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Aaliyah", LastName = "Aaliyah", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Aasif", LastName = "Mandvi", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Abbie", LastName = "Cornish", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Abhishek", LastName = "Bachchan", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Abigail", LastName = "Evans", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Abigail", LastName = "Spencer", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adam", LastName = "Arkin", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adam", LastName = "Baldwin", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adam", LastName = "Garcia", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adam", LastName = "Goldberg", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adam", LastName = "LeFevre", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adam", LastName = "Sandler", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adam", LastName = "Scott", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adrian", LastName = "Martinez", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adriana", LastName = "Barraza", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Adriana", LastName = "Caselotti", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Agnes", LastName = "Moorehead", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Ahna", LastName = "O'Reilly", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Aidan", LastName = "Quinn", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Aidan", LastName = "Turner", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Aimee", LastName = "Garcia", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Aisha", LastName = "Tyler", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Akon", LastName = "Akon", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Aksel", LastName = "Hennie", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Akshaye", LastName = "Khanna", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Al", LastName = "Pacino", ImageUrl = null
            },
            new Person()
            {
                FirstName = "Alain", LastName = "Delon", ImageUrl = null
            }
        };
    }
}