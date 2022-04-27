namespace Movies.API.Models;

public class CreateOrUpdateMovieRequest
{
    public int? Id { get; set; }
    public string Title { get; set; }
    public int Length { get; set; }
    public uint Year { get; set; }
    public string? TrailerUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImdbUrl { get; set; }
    public List<int> Genres { get; set; }
    public List<PersonRole> People { get; set; }
}