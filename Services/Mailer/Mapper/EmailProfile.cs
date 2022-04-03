using AutoMapper;
using Common.EventBus.Events;
using Mailer.Models;

namespace Mailer.Mapper
{
    public class EmailProfile : Profile
    {
        public EmailProfile()
        {
            CreateMap<WelcomeEmailEvent, WelcomeEmailModel>();
            CreateMap<ReservationEmailEvent, ReservationEmailModel>();
        }
    }
}
