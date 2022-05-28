using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Reservation.Repositories;

namespace Reservation.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
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