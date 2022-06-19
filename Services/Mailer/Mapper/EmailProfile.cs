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

            CreateMap<ReservationEmailEvent.Seat, ReservationEmailModel.Seat>();
            CreateMap<ReservationEmailEvent, ReservationEmailModel>();
            CreateMap<CancelReservationEmailEvent, CancelReservationEmailModel>();
            
            CreateMap<RescheduleScreeningEmailEvent, RescheduleScreeningEmailModel>();
            CreateMap<CancelScreeningEmailEvent, CancelScreeningEmailModel>();
        }
    }
}
