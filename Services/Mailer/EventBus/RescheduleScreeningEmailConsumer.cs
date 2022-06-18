using AutoMapper;
using Common.EventBus.Events;
using Mailer.Models;
using Mailer.Services;
using MassTransit;

namespace Mailer.EventBus
{
    public class RescheduleScreeningEmailConsumer : IConsumer<RescheduleScreeningEmailEvent>
    {
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public RescheduleScreeningEmailConsumer(IMapper mapper, IEmailService emailService)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }
        
        public async Task Consume(ConsumeContext<RescheduleScreeningEmailEvent> context)
        {
            await _emailService.SendRescheduleScreeningEmail(_mapper.Map<RescheduleScreeningEmailModel>(context.Message));
        }
    }
}