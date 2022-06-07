using AutoMapper;
using Reservation.Entities;
using Reservation.Models;

namespace Reservation.Mapper;

public class ReservationProfile : Profile
{
    public ReservationProfile()
    {
        CreateMap<Entities.Reservation, ReservationModel>();
        CreateMap<Movie, MovieModel>().ReverseMap();
        CreateMap<Entities.Screening, ScreeningModel>().ReverseMap();
    }
}