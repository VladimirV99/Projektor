using Common.EventBus.Events;
using MassTransit;
using Reservation.Repositories;

namespace Reservation.EventBus
{
    public class CancelScreeningEventConsumer : IConsumer<CancelScreeningEvent>
    {
        private readonly IReservationRepository _repository;
        private readonly IPublishEndpoint _publishEndpoint;

        public CancelScreeningEventConsumer(IReservationRepository repository, IPublishEndpoint publishEndpoint)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
        }
        
        public async Task Consume(ConsumeContext<CancelScreeningEvent> context)
        {
            var reservations = await _repository.GetReservationsForScreening(context.Message.ScreeningId);

            foreach (var reservation in reservations)
            {
                // Delete reservations for canceled screening
                await _repository.DeleteReservation(reservation.Id);
                
                // Notify mailer service
                await _publishEndpoint.Publish(new CancelScreeningEmailEvent(
                    reservation.User.Email,
                    reservation.Id,
                    reservation.Movie.Title,
                    reservation.Screening.MovieStart
                ));
            }
        }
    }
}