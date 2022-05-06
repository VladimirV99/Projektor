using AutoMapper;
using Review.Entities;
using Review.Models;

namespace Review.Mapper
{
    public class MovieReviewProfile : Profile
    {
        public MovieReviewProfile()
        {
            CreateMap<MovieReview, MovieReviewModel>();
        }
    }
}
