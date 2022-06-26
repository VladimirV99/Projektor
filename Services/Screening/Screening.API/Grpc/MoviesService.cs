using AutoMapper;
using Grpc.Core;
using Movies.GRPC;
using Screening.Common.Entities;

namespace Screening.API.Grpc
{
    public class MoviesService
    {
        private readonly MoviesProtoService.MoviesProtoServiceClient _client;
        private readonly IMapper _mapper;

        public MoviesService(MoviesProtoService.MoviesProtoServiceClient client, IMapper mapper)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<Movie?> GetMovieById(int id)
        {
            try
            {
                var movie = await _client.GetMovieByIdAsync(new GetMovieByIdRequest {Id = id});
                return _mapper.Map<Movie>(movie);
            }
            catch (RpcException)
            {
                return null;

            }
        }
    }    
}

