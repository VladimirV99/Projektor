using Movies.API.Constants;
using Movies.API.Data;
using Movies.API.Entities;
using Movies.API.Models;

namespace Movies.API.Services;

public class MoviesService : IMoviesService
{
    private readonly IMoviesRepository _repository;

    public MoviesService(IMoviesRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    private async Task<string?> PopulateGenresAndRoles(Movie movie, List<int> genreIds, List<PersonRole> peopleAndRoles)
    {
        foreach (var genreId in genreIds)
        {
            var genre = await _repository.GetGenreById(genreId);
            if (genre == null)
            {
                return ErrorMessages.GENRE_NOT_FOUND;
            }
                
            movie.Genres.Add(genre);
        }
            
        foreach (var personAndRole in peopleAndRoles)
        {
            var person = await _repository.GetPersonById(personAndRole.PersonId);
            if (person == null)
            {
                return ErrorMessages.PERSON_NOT_FOUND;
            }

            var role = await _repository.GetRoleById(personAndRole.RoleId);
            if (role == null)
            {
                return ErrorMessages.ROLE_NOT_FOUND;
            }
            movie.People.Add(new MoviePerson {Person = person, Role = role});
        }

        return null;
    }

    public async Task<string?> CreateMovie(CreateOrUpdateMovieRequest createOrUpdateMovieRequest)
    {
        var movie = new Movie
        {
            Title = createOrUpdateMovieRequest.Title,
            Year = createOrUpdateMovieRequest.Year,
            Length = createOrUpdateMovieRequest.Length,
            TrailerUrl = createOrUpdateMovieRequest.TrailerUrl,
            ImdbUrl = createOrUpdateMovieRequest.ImdbUrl,
            ImageUrl = createOrUpdateMovieRequest.ImageUrl,
            Genres = new List<Genre>(),
            People = new List<MoviePerson>()
        }; 
        
        var errorMessage = await PopulateGenresAndRoles(movie, createOrUpdateMovieRequest.Genres, createOrUpdateMovieRequest.People);
        if (errorMessage != null)
        {
            return errorMessage;
        }
        await _repository.CreateMovie(movie);
        return null;
    }

    public async Task<string?> UpdateMovie(CreateOrUpdateMovieRequest updateMovieRequest)
    {
        var movie = await _repository.GetMovieById(updateMovieRequest.Id ?? 0);
        if (movie == null)
        {
            return ErrorMessages.MOVIE_NOT_FOUND;
        }
        movie.Title = updateMovieRequest.Title;
        movie.Year = updateMovieRequest.Year;
        movie.Length = updateMovieRequest.Length;
        movie.TrailerUrl = updateMovieRequest.TrailerUrl;
        movie.ImdbUrl = updateMovieRequest.ImdbUrl;
        movie.ImageUrl = updateMovieRequest.ImageUrl;
        movie.Genres.Clear();
        movie.People.Clear();
        
        var errorMessage = await PopulateGenresAndRoles(movie, updateMovieRequest.Genres, updateMovieRequest.People);
        if (errorMessage != null)
        {
            return errorMessage;
        }
        
        await _repository.UpdateMovie(movie);
        return null;
    }

    public async Task CreatePerson(CreateOrUpdatePersonRequest request)
    {
        var person = new Person
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            ImdbUrl = request.ImdbUrl,
            Movies = new List<MoviePerson>()
        }; 
        
        await _repository.CreatePerson(person);
    }

    public async Task<string?> UpdatePerson(CreateOrUpdatePersonRequest request)
    {
        var person = await _repository.GetPersonById(request.Id ?? 0);
        if (person == null)
        {
            return ErrorMessages.PERSON_NOT_FOUND;
        }

        person.FirstName = request.FirstName;
        person.LastName = request.LastName;
        person.ImdbUrl = request.ImdbUrl;
        
        await _repository.UpdatePerson(person);
        return null;
    }
}