using AutoMapper;
using Grpc.Core;
using Movies.Common.Data;
using Movies.GRPC;

namespace Movies.GRPC.Services
{
    public class MoviesService : MoviesProtoService.MoviesProtoServiceBase
    {
        private readonly ILogger<MoviesService> _logger;
        private readonly IMoviesRepository _repository;
        private readonly IMapper _mapper;

        public MoviesService(ILogger<MoviesService> logger, IMoviesRepository repository, IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async override Task<MovieDTO> GetMovieById(GetMovieByIdRequest request, ServerCallContext context)
        {
            var movie = await _repository.GetMovieById(request.Id);

            if (movie == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Movie with id {request.Id} doesn't exist."));
            }

            return _mapper.Map<MovieDTO>(movie);

        }
    }
}