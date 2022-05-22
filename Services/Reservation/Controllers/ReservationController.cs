using Reservation.Data;
using AutoMapper;

namespace Reservation.Controllers
{
    public class ReservationController
    {
        private readonly IReservationRepository _repository;
        private readonly IMapper _mapper;

        public ReservationController(IReservationRepository repository, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
    }
}