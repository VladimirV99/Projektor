using AutoMapper;
using Movies.GRPC;
using Screening.Common.Entities;
using Screening.API.Models;

namespace Screening.API.Mapper
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            CreateMap<MovieDTO, Movie>();
            CreateMap<Movie, MovieModel>();
            CreateMap<InsertMovieRequest, Movie>();
        }
    }
}
