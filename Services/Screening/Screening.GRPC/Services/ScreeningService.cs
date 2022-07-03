using AutoMapper;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Screening.Common.Data;

namespace Screening.GRPC.Services
{
    public class ScreeningService : ScreeningProtoService.ScreeningProtoServiceBase
    {
        private readonly ILogger<ScreeningService> _logger;
        private readonly IScreeningRepository _repository;
        private readonly IMapper _mapper;

        public ScreeningService(ILogger<ScreeningService> logger, IScreeningRepository repository, IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
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
            return new DeleteHallResponse
            {
                Success = await _repository.DeleteHall(request.Id)
            };
        }
        
        public override async Task<MoviesResponse> GetCurrentMovies(Empty request, ServerCallContext context)
        {
            var response = new MoviesResponse();
            response.Movies.AddRange(await _repository.GetCurrentMovies());
            return response;
        }

        public override async Task<MoviesResponse> GetFutureMovies(Empty request, ServerCallContext context)
        {
            var response = new MoviesResponse();
            response.Movies.AddRange(await _repository.GetFutureMovies());
            return response;
        }        
    }
}