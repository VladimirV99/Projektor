using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Movies.API.Constants;

namespace Movies.API.Models;

public class FilterMoviesRequest
{
    [FromQuery(Name="page")]
    [Range(1, int.MaxValue, ErrorMessage=ErrorMessages.PAGE_NUMBER_AT_LEAST_ONE)]
    public int? Page { get; set; }
    
    [FromQuery(Name="perPage")]
    [Range(1, Misc.MAX_PAGE_SIZE, ErrorMessage=ErrorMessages.PER_PAGE_TOO_LARGE)]
    public int? PerPage { get; set; }
    
    [FromQuery(Name="yearFrom")]
    public int? YearFrom { get; set; }
    
    [FromQuery(Name="yearTo")]
    public int? YearTo { get; set; }
    
    [FromQuery(Name="lengthFrom")]
    public int? LengthFrom { get; set; }
    
    [FromQuery(Name="lengthTo")]
    public int? LengthTo { get; set; }
}