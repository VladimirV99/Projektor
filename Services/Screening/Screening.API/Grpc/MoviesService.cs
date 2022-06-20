using Grpc.Core;
using Movies.GRPC;

namespace Screening.API.Grpc
{
    public class MoviesService
    {
        private readonly MoviesProtoService.MoviesProtoServiceClient _client;
    }    
}

