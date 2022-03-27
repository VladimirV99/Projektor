namespace Movies.API.Models;

public class GenreWithMoviesModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<MovieModel> Movies { get; set; }
}