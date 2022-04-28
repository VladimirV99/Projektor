using Common.Auth.Extensions;
using Common.Auth.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Review.Data;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.ConfigureJWT(builder.Configuration.GetSection("JWT").Get<JwtSettings>());

builder.Services.AddDbContext<ReviewContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ReviewConnectionString"));
});

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

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