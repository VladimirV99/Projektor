using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;

namespace Common.Auth.Swagger
{
    public class AuthOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var anonymousAttribute = context.MethodInfo
                .GetCustomAttributes(true)
                .OfType<AllowAnonymousAttribute>();
            if (anonymousAttribute.Any())
                return;

            var classAuthAttributes = context.MethodInfo.DeclaringType!
                .GetCustomAttributes(true)
                .OfType<AuthorizeAttribute>();

            var methodAuthAttributes = context.MethodInfo
                .GetCustomAttributes(true)
                .OfType<AuthorizeAttribute>();

            var authAttributes = classAuthAttributes.Concat(methodAuthAttributes).Distinct();
            if (authAttributes.Any())
            {
                var requiredRoles = authAttributes
                    .Where(attribute => attribute.Roles != null)
                    .Select(attribute => string.Join(" / ", attribute.Roles!.Split(",").Select(role => role.Trim())))
                    .DefaultIfEmpty("Any");

                StringBuilder sb = new();
                sb.Append("<b>Required Access Privileges</b>: ");
                sb.Append(string.Join(", ", requiredRoles));
                operation.Description += sb.ToString();

                operation.Responses.TryAdd("401", new OpenApiResponse { Description = "Unauthorized" });
                operation.Responses.TryAdd("403", new OpenApiResponse { Description = "Forbidden" });

                var jwtBearerScheme = new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                };

                operation.Security = new List<OpenApiSecurityRequirement>
                {
                    new OpenApiSecurityRequirement
                    {
                        [ jwtBearerScheme ] = Array.Empty<string>()
                    }
                };
            }
        }
    }
}
