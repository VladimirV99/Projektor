using AutoMapper;
using Common.EventBus.Events;
using Grpc.Core;
using MassTransit;
using Screening.Common.Data;

namespace Screening.GRPC.Services
{
    public class ScreeningService : ScreeningProtoService.ScreeningProtoServiceBase
    {
        private readonly ILogger<ScreeningService> _logger;
        private readonly IScreeningRepository _repository;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;

        public ScreeningService(ILogger<ScreeningService> logger, IScreeningRepository repository, IMapper mapper, IPublishEndpoint publishEndpoint)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
        }

        public override async Task<GetScreeningResponse> GetScreening(GetScreeningRequest request, ServerCallContext context)
        {
            var screening = await _repository.GetScreeningById(request.Id);

            if (screening == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Screening with id = ${request.Id} doesn't exists."));
            }

            return _mapper.Map<GetScreeningResponse>(screening);
        }

        public override async Task<DeleteMovieResponse> DeleteMovie(DeleteMovieRequest request, ServerCallContext context)
        {
            var screenings = (await _repository.GetScreeningsByMovieId(request.Id)).Where(s => s.MovieStart > DateTime.UtcNow);
            if (screenings.Any())
            {
                return new DeleteMovieResponse{Success=false};
            }

            await _repository.DeleteMovie(request.Id);
            return new DeleteMovieResponse {Success = true};
        }

        public override async Task<UpdateMovieResponse> UpdateMovie(UpdateMovieRequest request, ServerCallContext context)
        {
            return new UpdateMovieResponse
            {
                Success = await _repository.UpdateMovie(request.Id, request.Title, request.Length)
            };
        }

        public override async Task<DeleteHallResponse> DeleteHall(DeleteHallRequest request, ServerCallContext context)
        {
            var (success, toDelete) = await _repository.DeleteHall(request.Id);
            foreach (var toDeleteId in toDelete)
            {
                await _publishEndpoint.Publish(new CancelScreeningEvent(toDeleteId));
            }
            return new DeleteHallResponse
            {
                Success = success
            };
        }
    }
}