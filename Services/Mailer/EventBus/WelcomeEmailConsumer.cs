using AutoMapper;
using Common.EventBus.Events;
using Mailer.Models;
using Mailer.Services;
using MassTransit;

namespace Mailer.EventBus
{
    public class WelcomeEmailConsumer : IConsumer<WelcomeEmailEvent>
    {
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public WelcomeEmailConsumer(IMapper mapper, IEmailService emailService)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }

        public async Task Consume(ConsumeContext<WelcomeEmailEvent> context)
        {
            await _emailService.SendWelcomeEmail(_mapper.Map<WelcomeEmailModel>(context.Message));
        }
    }
}
