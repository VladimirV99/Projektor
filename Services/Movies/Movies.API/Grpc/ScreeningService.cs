using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Movies.Common.Data;
using Movies.Common.Entities;
using Screening.GRPC;

namespace Movies.API.Grpc
{
    public class ScreeningService
    {
        private readonly ScreeningProtoService.ScreeningProtoServiceClient _client;
        private readonly IMoviesRepository _repository;
        private readonly ILogger<ScreeningService> _logger;

        public ScreeningService(ScreeningProtoService.ScreeningProtoServiceClient client, IMoviesRepository repository,
            ILogger<ScreeningService> logger)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> DeleteMovie(int id)
        {
            try
            {
                var response = await _client.DeleteMovieAsync(new DeleteMovieRequest {Id = id});
                return response.Success;
            }
            catch (RpcException)
            {
                return false;
            }
        }
        
        public async Task<bool> UpdateMovie(int id, int length, string title)
        {
            try
            {
                var response = await _client.UpdateMovieAsync(new UpdateMovieRequest{Id = id, Length = length, Title = title});
                return response.Success;
            }
            catch (RpcException)
            {
                return false;
            }
        }

        public async Task<IEnumerable<Movie>> GetCurrentMovies()
        {
            try
            {
                var response = await _client.GetCurrentMoviesAsync(new Empty());
                return await _repository.GetMoviesById(response.Movies);
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "Error occurred while fetching current movies");
                return new List<Movie>();
            }
        }
        
        public async Task<IEnumerable<Movie>> GetFutureMovies()
        {
            try
            {
                var response = await _client.GetFutureMoviesAsync(new Empty());
                return await _repository.GetMoviesById(response.Movies);
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "Error occurred while fetching future movies");
                return new List<Movie>();
            }
        }

    }
}

