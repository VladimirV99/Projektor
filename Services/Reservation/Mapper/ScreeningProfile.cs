using AutoMapper;
using Reservation.Models;

namespace Reservation.Mapper
{
    public class ScreeningProfile : Profile
    {
        public ScreeningProfile()
        {
            CreateMap<Screening.GRPC.GetScreeningResponse, GetScreeningResponse>()
                .ForMember(
                    s => s.MovieStart,
                    opt => opt.MapFrom(screening => screening.MovieStart.ToDateTime())
                );
            CreateMap<Screening.GRPC.GetScreeningResponse.Types.Movie, MovieModel>();
        }
    }
}