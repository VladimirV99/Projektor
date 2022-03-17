using AutoMapper;
using Identity.Entities;
using Identity.Models;

namespace Identity.Mapper
{
    public class IdentityProfile : Profile
    {
        public IdentityProfile()
        {
            CreateMap<UserRegisterRequest, User>()
                .ForMember(user => user.UserName, opt => opt.MapFrom(request => request.Email));
        }
    }
}
