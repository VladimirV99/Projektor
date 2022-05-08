using Movies.API.Models;

namespace Movies.API.Services;

public interface IMoviesService
{
    Task<string?> CreateMovie(CreateOrUpdateMovieRequest request);
    Task<string?> UpdateMovie(CreateOrUpdateMovieRequest request);
}