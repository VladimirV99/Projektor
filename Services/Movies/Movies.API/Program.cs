using System.Reflection;
using System.Text.Json.Serialization;
using Movies.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<MovieContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("MoviesConnectionString"));
    options.EnableSensitiveDataLogging();
});
builder.Services.AddScoped<IMoviesRepository, MoviesRepository>();
// Not sure if there is a better way to avoid cycle errors when populating related entities, this is kind of ugly because
// it gives something like this: movie: {blabla, genres: [ {id, name, movies: [null]} ]}
// The mapper will make it nice anyway so idk
builder.Services.AddControllers()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


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
    
