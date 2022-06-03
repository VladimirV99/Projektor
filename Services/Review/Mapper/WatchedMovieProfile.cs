using AutoMapper;
using Common.EventBus.Events;
using Review.Entities;
using Review.Models;

namespace Review.Mapper
{
    public class WatchedMovieProfile : Profile
    {
        public WatchedMovieProfile()
        {
            CreateMap<AddWatchedMovieRequest, WatchedMovie>();
            CreateMap<AddWatchedMovieEvent, WatchedMovie>();
        }
    }
}
