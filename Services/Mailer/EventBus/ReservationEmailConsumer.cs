using AutoMapper;
using Common.EventBus.Events;
using Mailer.Models;
using Mailer.Services;
using MassTransit;

namespace Mailer.EventBus
{
    public class ReservationEmailConsumer : IConsumer<ReservationEmailEvent>
    {
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public ReservationEmailConsumer(IMapper mapper, IEmailService emailService)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }

        public async Task Consume(ConsumeContext<ReservationEmailEvent> context)
        {
            await _emailService.SendReservationEmail(_mapper.Map<ReservationEmailModel>(context.Message));
        }
    }
}
