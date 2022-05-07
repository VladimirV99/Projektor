using System.ComponentModel.DataAnnotations;
using Movies.API.Constants;

namespace Movies.API.Models;

public class CreateOrUpdateMovieRequest
{
    public int? Id { get; set; }
    
    [Required(ErrorMessage = ErrorMessages.TITLE_REQUIRED)]
    public string Title { get; set; }
    
    [Required(ErrorMessage = ErrorMessages.LENGTH_REQUIRED)]
    public int Length { get; set; }
    
    [Required(ErrorMessage = ErrorMessages.YEAR_REQUIRED)]
    public uint Year { get; set; }
    
    public string? TrailerUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImdbUrl { get; set; }
    
    [Required(ErrorMessage = ErrorMessages.GENRES_REQUIRED)]
    public List<int> Genres { get; set; }
    
    [Required(ErrorMessage = ErrorMessages.PEOPLE_AND_ROLES_REQUIRED)]
    public List<PersonRole> People { get; set; }
}