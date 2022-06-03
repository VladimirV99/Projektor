using AutoMapper;
using Screening.Common.Entities;
using Screening.Common.Models;

namespace Screening.Common.Mapper
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
