using AutoMapper;
using Reservation.Entities;
using Reservation.Models;

namespace Reservation.Mapper
{
    public class HallProfile : Profile
    {
        public HallProfile()
        {
            CreateMap<Hall, HallBasicModel>();
        }
    }
}