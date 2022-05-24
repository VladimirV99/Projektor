using Movies.API.Models;

namespace Movies.API.Services;

public interface IMoviesService
{
    Task<string?> CreateMovie(CreateOrUpdateMovieRequest request);
    Task<string?> UpdateMovie(CreateOrUpdateMovieRequest request);
    
    Task CreatePerson(CreateOrUpdatePersonRequest request);
    Task<string?> UpdatePerson(CreateOrUpdatePersonRequest request);
    
}