using AutoMapper;
using Screening.Common.Models;

namespace Screening.Common.Mapper
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
