using AutoMapper;
using Screening.Models;

namespace Screening.Mapper
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            CreateMap<Entities.Movie, MovieModel>();
        }
    }
}
