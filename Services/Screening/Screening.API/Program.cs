using Screening.Common.Data;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Screening.Common.Extensions;
using Movies.GRPC;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ScreeningContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ScreeningsConnectionString"));
});

builder.Services.AddControllers();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.AddScoped<IScreeningRepository, ScreeningRepository>();
builder.Services.AddTransient<IDataSeeder, DataSeeder>();
builder.Services.AddGrpcClient<MoviesProtoService.MoviesProtoServiceBase>(o =>
    o.Address = new Uri(builder.Configuration["gRPC:MoviesUrl"]));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

app.SeedDatabase();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowAnyOrigin()
    );
}

app.UseAuthorization();

app.MapControllers();

app.Run();