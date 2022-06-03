using AutoMapper;
using Screening.Common.Entities;
using Screening.Common.Models;

namespace Screening.Common.Mapper
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
