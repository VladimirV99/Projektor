using Common.Auth.Extensions;
using Common.Auth.Models;
using Microsoft.OpenApi.Models;
using Review.Data;
using Review.Repositories;
using System.Reflection;
using Common.EventBus.Constants;
using MassTransit;
using Review.EventBus;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.ConfigureJWT(builder.Configuration.GetSection("JWT").Get<JwtSettings>());

builder.Services.AddScoped<ReviewContext>();
builder.Services.AddTransient<IDataSeeder, DataSeeder>();

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

builder.Services.AddMassTransit(config =>
{
    var eventBusSettings = builder.Configuration.GetSection("EventBus");

    config.AddConsumer<AddWatchedMovieConsumer>();
    config.AddConsumer<RemoveWatchedMovieConsumer>();

    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(eventBusSettings["Host"], h =>
        {
            h.Username(eventBusSettings["Username"]);
            h.Password(eventBusSettings["Password"]);
        });

        cfg.ReceiveEndpoint(EventQueues.REVIEW, c =>
        {
            c.ConfigureConsumer<AddWatchedMovieConsumer>(ctx);
            c.ConfigureConsumer<RemoveWatchedMovieConsumer>(ctx);
        });
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Review Server",
        Description = "Review Server for Projektor Application"
    });
    options.AddJwtSecurityDefinition();
    options.AddAuthOperationFilter();
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetService<IDataSeeder>();
    if (seeder != null)
    {
        seeder.Seed();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();