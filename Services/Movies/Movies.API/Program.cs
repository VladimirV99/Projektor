using System.Reflection;
using System.Text.Json.Serialization;
using Common.Auth.Extensions;
using Common.Auth.Models;
using Movies.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Movies.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<MovieContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("MoviesConnectionString"));
    options.EnableSensitiveDataLogging();
});
builder.Services.AddScoped<IMoviesRepository, MoviesRepository>();
builder.Services.AddScoped<IMoviesService, MoviesService>();
builder.Services.AddControllers()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.ConfigureJWT(builder.Configuration.GetSection("JWT").Get<JwtSettings>());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Movie API",
        Description = "Movie API for Projektor Application"
    });
    options.AddJwtSecurityDefinition();
    options.AddAuthOperationFilter();
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(x => x.AllowAnyMethod()
                                    .AllowAnyHeader()
                                    .AllowAnyOrigin());
}

app.UseAuthorization();

app.MapControllers();

app.Run();
    
