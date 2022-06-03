using AutoMapper;
using Google.Protobuf.WellKnownTypes;

namespace Screening.GRPC.Mapper
{
    public class ScreeningProfile: Profile
    {
        public ScreeningProfile()
        {
            CreateMap<Common.Entities.Screening, GetScreeningResponse>().ForMember(s => s.MovieStart, x => x.MapFrom(t => Timestamp.FromDateTime(DateTime.SpecifyKind(t.MovieStart, DateTimeKind.Utc))));
            CreateMap<Common.Entities.Movie, GetScreeningResponse.Types.Movie>();
        }
    }
}