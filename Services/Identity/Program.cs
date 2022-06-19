using Common.Auth.Extensions;
using Common.Auth.Models;
using FluentValidation.AspNetCore;
using Identity.Extensions;
using Identity.Services;
using Microsoft.OpenApi.Models;
using System.Reflection;
using MassTransit;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.ConfigurePersistence(builder.Configuration);
builder.Services.ConfigureIdentity();
builder.Services.ConfigureJWT(builder.Configuration.GetSection("JWT").Get<JwtSettings>());

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

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

builder.Services.AddControllers().AddFluentValidation(fv =>
{
    fv.RegisterValidatorsFromAssembly(Assembly.GetExecutingAssembly());
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Identity Server",
        Description = "Identity Server for Projektor Application"
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
