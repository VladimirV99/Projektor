using System.ComponentModel.DataAnnotations;

namespace Movies.API.Models;

public class CreateOrUpdateMovieRequest
{
    public int? Id { get; set; }
    
    [Required]
    public string Title { get; set; }
    
    [Required]
    public int Length { get; set; }
    
    [Required(ErrorMessage = "Year is required.")]
    public uint Year { get; set; }
    
    public string? TrailerUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImdbUrl { get; set; }
    
    [Required]
    public List<int> Genres { get; set; }
    
    [Required]
    public List<PersonRole> People { get; set; }
}