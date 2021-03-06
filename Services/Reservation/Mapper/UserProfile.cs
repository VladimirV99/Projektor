using AutoMapper;
using Common.Auth.Models;
using Reservation.Entities;
using Reservation.Models;

namespace Reservation.Mapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserInfo, User>();
            CreateMap<UserInfo, Common.EventBus.Models.User>();
            CreateMap<User, UserModel>();
        }
    }
}