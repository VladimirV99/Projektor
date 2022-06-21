using Common.EventBus.Events;
using MassTransit;
using Reservation.Repositories;

namespace Reservation.EventBus
{
    public class RescheduleScreeningEventConsumer : IConsumer<RescheduleScreeningEvent>
    {
        private readonly IReservationRepository _repository;
        private readonly IPublishEndpoint _publishEndpoint;

        public RescheduleScreeningEventConsumer(IReservationRepository repository, IPublishEndpoint publishEndpoint)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
        }

        public async Task Consume(ConsumeContext<RescheduleScreeningEvent> context)
        {
            var reservations = await _repository.GetReservationsForScreening(context.Message.ScreeningId);

            foreach (var reservation in reservations)
            {
                // Update start time in reservations
                await _repository.UpdateReservationStartTime(reservation.Id, context.Message.NewTime);
                
                // Notify mailer service
                await _publishEndpoint.Publish(new RescheduleScreeningEmailEvent(
                    reservation.User.Email,
                    reservation.Id,
                    reservation.Movie.Title,
                    context.Message.OldTime,
                    context.Message.NewTime
                ));
            }
        }
    }
}