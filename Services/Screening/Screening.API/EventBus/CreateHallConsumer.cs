using AutoMapper;
using Common.EventBus.Events;
using MassTransit;
using Screening.Common.Data;
using Screening.Common.Entities;

namespace Screening.API.EventBus
{
    public class CreateHallConsumer : IConsumer<CreateHallEvent>
    {
        private readonly IScreeningRepository _repository;
        private readonly IMapper _mapper;

        public CreateHallConsumer(IScreeningRepository repository, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task Consume(ConsumeContext<CreateHallEvent> context)
        {
            await _repository.InsertHall(_mapper.Map<Hall>(context.Message));
        }
    }
}
