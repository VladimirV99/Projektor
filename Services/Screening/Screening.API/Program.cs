using Screening.Common.Data;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Screening.Common.Extensions;
using Movies.GRPC;
using Common.Auth.Models;
using Common.Auth.Extensions;
using MassTransit;
using Microsoft.OpenApi.Models;
using Screening.API.Grpc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.ConfigureJWT(builder.Configuration.GetSection("JWT").Get<JwtSettings>());

builder.Services.AddDbContext<ScreeningContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ScreeningsConnectionString"));
});

builder.Services.AddControllers();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.AddScoped<IScreeningRepository, ScreeningRepository>();
builder.Services.AddScoped<MoviesService, MoviesService>();
builder.Services.AddTransient<IDataSeeder, DataSeeder>();
builder.Services.AddGrpcClient<MoviesProtoService.MoviesProtoServiceClient>(o =>
    o.Address = new Uri(builder.Configuration["gRPC:MoviesUrl"]));

builder.Services.AddMassTransit(config =>
{
    var eventBusSettings = builder.Configuration.GetSection("EventBus");

    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(eventBusSettings["Host"], h =>
        {
            h.Username(eventBusSettings["Username"]);
            h.Password(eventBusSettings["Password"]);
        });
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Screening Server",
        Description = "Screening Server for Projektor Application"
    });
    options.AddJwtSecurityDefinition();
    options.AddAuthOperationFilter();
});

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();