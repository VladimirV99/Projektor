using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOcelot();
builder.Configuration.AddJsonFile("ocelot.json");
builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors(x => x.AllowAnyMethod()
        .AllowAnyHeader()
        .AllowAnyOrigin()
    );
}

app.UseOcelot().Wait();
app.Run();