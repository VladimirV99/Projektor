using System;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using Movies.API.Entities;
using Movies.API.Models;

namespace Movies.API.Mapper
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            CreateMap<Genre, GenreSimpleModel>();
            CreateMap<Genre, GenreWithMoviesModel>()
                .ForMember(dest => dest.Movies,
                                opt => opt.MapFrom(src => src.Movies));
            CreateMap<MoviePerson, PersonRoleModel>()
                .ForMember(dest => dest.Name,
                    opt => opt.MapFrom(src => $"{src.Person.FirstName} {src.Person.LastName}"))
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom(src => src.Role.Name));
                                        
            CreateMap<Movie, MovieModel>()
                .ForMember(dest => dest.Genres,
                    opt => opt.MapFrom(src => src.Genres))
                .ForMember(dest => dest.People,
                    opt => opt.MapFrom(src => src.People));

        }

    }
}

