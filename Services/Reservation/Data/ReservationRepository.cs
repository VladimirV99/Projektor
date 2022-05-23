namespace Reservation.Data
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly ReservationContext _dbContext;

        public ReservationRepository(ReservationContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }
    }
}
