using AutoMapper;
using Common.EventBus.Events;
using MassTransit;
using Review.Repositories;

namespace Review.EventBus
{
    public class RemoveWatchedMovieConsumer : IConsumer<RemoveWatchedMovieEvent>
    {
        private readonly IMapper _mapper;
        private readonly IReviewRepository _repository;

        public RemoveWatchedMovieConsumer(IMapper mapper, IReviewRepository repository)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task Consume(ConsumeContext<RemoveWatchedMovieEvent> context)
        {
            await _repository.RemoveWatchedMovie(
                context.Message.MovieId,
                context.Message.UserId,
                context.Message.ReservationId
            );
        }
    }
}