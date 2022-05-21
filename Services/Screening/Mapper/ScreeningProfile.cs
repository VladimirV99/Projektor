using AutoMapper;
using Screening.Models;

namespace Screening.Mapper
{
    public class ScreeningProfile : Profile
    {
        public ScreeningProfile()
        {
            CreateMap<Entities.Screening, ScreeningModel>();
            CreateMap<InsertScreeningRequest, Entities.Screening>();
        }
    }
}
