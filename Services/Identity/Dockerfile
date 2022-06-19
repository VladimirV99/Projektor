#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Services/Identity/Identity.csproj", "Services/Identity/"]
COPY ["Common/Auth/Auth.csproj", "Common/Auth/"]
COPY ["Common/EventBus/EventBus.csproj", "Common/EventBus/"]
RUN dotnet restore "Services/Identity/Identity.csproj"
COPY . .
WORKDIR "/src/Services/Identity"
RUN dotnet build "Identity.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Identity.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Identity.dll"]