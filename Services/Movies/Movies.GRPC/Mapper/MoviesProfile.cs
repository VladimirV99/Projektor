using AutoMapper;
using Movies.Common.Entities;

namespace Movies.GRPC.Mapper
{
    public class MoviesProfile : Profile
    {
        public MoviesProfile()
        {
            CreateMap<Movie, MovieDTO>();
        }
    }
}
