using Common.Auth.Extensions;
using Common.Auth.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Reservation.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.ConfigureJWT(builder.Configuration.GetSection("JWT").Get<JwtSettings>());

builder.Services.AddDbContext<ReservationContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ReservationsConnectionString"));
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Reservations Server",
        Description = "Reservations Server for Projektor Application"
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
