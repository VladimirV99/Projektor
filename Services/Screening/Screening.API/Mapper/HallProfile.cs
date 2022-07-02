using AutoMapper;
using Common.EventBus.Events;
using Screening.API.Models;
using Screening.Common.Entities;

namespace Screening.API.Mapper
{
    public class HallProfile : Profile
    {
        public HallProfile()
        {
            CreateMap<Hall, HallModel>();
            CreateMap<InsertHallRequest, Hall>();
            CreateMap<CreateHallEvent, Hall>();
        }
    }
}
