using Common.EventBus.Constants;
using Mailer.EventBus;
using Mailer.Models;
using Mailer.Services;
using MassTransit;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddMassTransit(config =>
{
    var eventBusSettings = builder.Configuration.GetSection("EventBus");

    config.AddConsumer<WelcomeEmailConsumer>();
    config.AddConsumer<ReservationEmailConsumer>();

    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(eventBusSettings["Host"], h =>
        {
            h.Username(eventBusSettings["Username"]);
            h.Password(eventBusSettings["Password"]);
        });

        cfg.ReceiveEndpoint(EventQueues.MAIL, c =>
        {
            c.ConfigureConsumer<WelcomeEmailConsumer>(ctx);
            c.ConfigureConsumer<ReservationEmailConsumer>(ctx);
        });
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
