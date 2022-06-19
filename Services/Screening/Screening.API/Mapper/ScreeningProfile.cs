using AutoMapper;
using Screening.API.Models;

namespace Screening.API.Mapper
{
    public class ScreeningProfile : Profile
    {
        public ScreeningProfile()
        {
            CreateMap<Common.Entities.Screening, ScreeningModel>();
            CreateMap<InsertScreeningRequest, Common.Entities.Screening>();
        }
    }
}
