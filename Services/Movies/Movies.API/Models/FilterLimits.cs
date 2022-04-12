namespace Movies.API.Models;

public class FilterLimits
{
    public uint YearMin { get; set; }
    public uint YearMax { get; set; }
    public int LengthMin { get; set; }
    public int LengthMax { get; set; }
}