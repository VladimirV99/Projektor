using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Movies.API.Constants;

namespace Movies.API.Models;

public class FilterMoviesRequest
{
    [FromQuery(Name="Page")]
    [Range(1, int.MaxValue, ErrorMessage=ErrorMessages.PAGE_NUMBER_AT_LEAST_ONE)]
    public int? Page { get; set; }
    
    [FromQuery(Name="PerPage")]
    [Range(1, Settings.MAX_PAGE_SIZE, ErrorMessage=ErrorMessages.PER_PAGE_TOO_LARGE)]
    public int? PerPage { get; set; }
    
    [FromQuery(Name="YearFrom")]
    public int? YearFrom { get; set; }
    
    [FromQuery(Name="YearTo")]
    public int? YearTo { get; set; }
    
    [FromQuery(Name="LengthFrom")]
    public int? LengthFrom { get; set; }
    
    [FromQuery(Name="LengthTo")]
    public int? LengthTo { get; set; }
    
    [FromQuery(Name="Genres[]")]
    public List<int>? Genres { get; set; }
    
    [FromQuery(Name="People")]
    public List<int>? People { get; set; }
}