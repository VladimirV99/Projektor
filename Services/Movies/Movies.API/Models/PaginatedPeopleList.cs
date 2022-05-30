namespace Movies.API.Models;

public class PaginatedPeopleList
{
    public List<PersonModel> People { get; set; }
    public int Count { get; set; }
}