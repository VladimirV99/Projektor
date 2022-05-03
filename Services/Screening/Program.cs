using Screening.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ScreeningContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ScreeningsConnectionString"));
    options.EnableSensitiveDataLogging();
});
builder.Services.AddControllers();
builder.Services.AddScoped<IScreeningRepository, ScreeningRepository>();

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