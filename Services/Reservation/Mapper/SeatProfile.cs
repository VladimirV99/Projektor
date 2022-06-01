using AutoMapper;
using Reservation.Entities;
using Reservation.Models;

namespace Reservation.Mapper
{
    public class SeatProfile : Profile
    {
        public SeatProfile()
        {
            CreateMap<CreateSeatRequest, Seat>();
            CreateMap<Seat, SeatModel>();
            CreateMap<Seat, SeatCoordinates>();
        }
    }
}