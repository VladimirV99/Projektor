using AutoMapper;
using Screening.Entities;
using Screening.Models;

namespace Screening.Mapper
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            CreateMap<Movie, MovieModel>();
            CreateMap<InsertMovieRequest, Movie>();
        }
    }
}
