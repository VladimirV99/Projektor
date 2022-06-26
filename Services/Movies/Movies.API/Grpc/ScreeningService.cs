using Grpc.Core;
using Screening.GRPC;

namespace Movies.API.Grpc
{
    public class ScreeningService
    {
        private readonly ScreeningProtoService.ScreeningProtoServiceClient _client;

        public ScreeningService(ScreeningProtoService.ScreeningProtoServiceClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
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
    }
}

