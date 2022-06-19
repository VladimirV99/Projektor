using AutoMapper;
using Common.EventBus.Events;
using Mailer.Models;
using Mailer.Services;
using MassTransit;

namespace Mailer.EventBus
{
    public class CancelScreeningEmailConsumer : IConsumer<CancelScreeningEmailEvent>
    {
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public CancelScreeningEmailConsumer(IMapper mapper, IEmailService emailService)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }
        
        public async Task Consume(ConsumeContext<CancelScreeningEmailEvent> context)
        {
            await _emailService.SendCancelScreeningEmail(_mapper.Map<CancelScreeningEmailModel>(context.Message));
        }
    }
}