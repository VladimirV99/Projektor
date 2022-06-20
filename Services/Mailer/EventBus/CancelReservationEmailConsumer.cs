using AutoMapper;
using Common.EventBus.Events;
using Mailer.Models;
using Mailer.Services;
using MassTransit;

namespace Mailer.EventBus
{
    public class CancelReservationEmailConsumer : IConsumer<CancelReservationEmailEvent>
    {
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public CancelReservationEmailConsumer(IMapper mapper, IEmailService emailService)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }
        
        public async Task Consume(ConsumeContext<CancelReservationEmailEvent> context)
        {
            await _emailService.SendCancelReservationEmail(_mapper.Map<CancelReservationEmailModel>(context.Message));
        }
    }
}