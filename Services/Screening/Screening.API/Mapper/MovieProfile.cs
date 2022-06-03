using AutoMapper;
using Screening.Common.Entities;
using Screening.API.Models;

namespace Screening.API.Mapper
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
