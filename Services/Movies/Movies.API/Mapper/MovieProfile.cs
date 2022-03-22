using System;
using AutoMapper;
using Movies.API.Entities;
using Movies.API.Models;

namespace Movies.API.Mapper
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            //CreateMap<Movie, MovieModel>()
            //        .ForMember(m => m.Genres, opt => opt.MapFrom(m => m.Genres))
            //        .ForMember(m => m.People, opt => opt.MapFrom());

        }

    }
}

