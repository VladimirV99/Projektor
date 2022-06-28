using AutoMapper;
using Grpc.Core;
using Screening.GRPC;
using GetScreeningResponse = Reservation.Models.GetScreeningResponse;

namespace Reservation.Grpc
{
    public class ScreeningService
    {
        private readonly ScreeningProtoService.ScreeningProtoServiceClient _client;
        private readonly IMapper _mapper;

        public ScreeningService(ScreeningProtoService.ScreeningProtoServiceClient client, IMapper mapper)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<GetScreeningResponse?> GetScreeningById(int id)
        {
            var request = new GetScreeningRequest
            {
                Id = id
            };

            try
            {
                var result = await _client.GetScreeningAsync(request);
                return result == null ? null : _mapper.Map<GetScreeningResponse>(result);
            }
            catch (RpcException)
            {
                return null;
            }
        }

        public async Task<bool> DeleteHall(int id)
        {
            var response = await _client.DeleteHallAsync(new DeleteHallRequest {Id = id});
            return response.Success;
        }
    }
}