using Common.Auth.Swagger;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Common.Auth.Extensions
{
    public static class SwaggerExtensions
    {
        public static void AddJwtSecurityDefinition(this SwaggerGenOptions options)
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter JWT access token:",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
        }

        public static void AddAuthOperationFilter(this SwaggerGenOptions options)
        {
            options.OperationFilter<AuthOperationFilter>();
        }
    }
}
