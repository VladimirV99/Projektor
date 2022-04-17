namespace Movies.API.Models;

public class PaginatedMovieList
{
    public List<MovieModel> Movies { get; set; }
    public int Count { get; set; }
}