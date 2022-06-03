using AutoMapper;
using Review.Entities;
using Review.Models;

namespace Review.Mapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserModel>().ReverseMap();
            CreateMap<Common.EventBus.Models.User, User>();
        }
    }
}
