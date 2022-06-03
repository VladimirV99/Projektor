namespace Movies.API.Models;

public class PersonModel
{
    public int Id { get; set; }
    public string FirstName { get; set;  }
    public string LastName { get; set; }
    public string ImdbUrl { get; set; }
    public List<MovieSimpleModel> Movies { get; set; }
}