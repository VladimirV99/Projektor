using AutoMapper;
using Common.EventBus.Events;
using MassTransit;
using Review.Entities;
using Review.Repositories;

namespace Review.EventBus
{
    public class AddWatchedMovieConsumer : IConsumer<AddWatchedMovieEvent>
    {
        private readonly IMapper _mapper;
        private readonly IReviewRepository _repository;

        public AddWatchedMovieConsumer(IMapper mapper, IReviewRepository repository)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task Consume(ConsumeContext<AddWatchedMovieEvent> context)
        {
            var watchedMovie = context.Message;

            var user = await _repository.GetUserById(watchedMovie.User.Id);
            if (user == null)
            {
                await _repository.CreateUser(_mapper.Map<User>(watchedMovie.User));
            }
            
            await _repository.AddWatchedMovie(new WatchedMovie
            {
                MovieId = watchedMovie.MovieId,
                ReservationId = watchedMovie.ReservationId,
                UserId = watchedMovie.User.Id,
                WatchedOn = watchedMovie.WatchedOn
            });
        }
    }
}