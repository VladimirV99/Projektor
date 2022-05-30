using System.ComponentModel.DataAnnotations;
using Movies.API.Constants;

namespace Movies.API.Models;

public class CreateOrUpdatePersonRequest
{
    public int? Id { get; set; }
    
    [Required(ErrorMessage = ErrorMessages.FIRST_NAME_REQUIRED)]
    public string FirstName { get; set; }
    
    [Required(ErrorMessage = ErrorMessages.LAST_NAME_REQUIRED)]
    public string LastName { get; set; }
    
    public string? ImdbUrl { get; set; }
}