using AutoMapper;
using Grpc.Core;
using Screening.Common.Data;

namespace Screening.GRPC.Services
{
    public class ScreeningService : ScreeningProtoService.ScreeningProtoServiceBase
    {
        private readonly ILogger<ScreeningService> _logger;
        private readonly IScreeningRepository _repostory;
        private readonly IMapper _mapper;

        public ScreeningService(ILogger<ScreeningService> logger, IScreeningRepository repostory, IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _repostory = repostory ?? throw new ArgumentNullException(nameof(repostory));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async override Task<GetScreeningResponse> GetScreening(GetScreeningRequest request, ServerCallContext context)
        {
            var screening = await _repostory.GetScreeningById(request.Id);

            if (screening == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Screening with id = ${request.Id} doesn't exists."));
            }

            return _mapper.Map<GetScreeningResponse>(screening);
        }
    }
}