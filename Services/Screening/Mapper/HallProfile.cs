using AutoMapper;
using Screening.Entities;
using Screening.Models;

namespace Screening.Mapper
{
    public class HallProfile : Profile
    {
        public HallProfile()
        {
            CreateMap<Hall, HallModel>();
            CreateMap<InsertHallRequest, Hall>();
        }
    }
}
