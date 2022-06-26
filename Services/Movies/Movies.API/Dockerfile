#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Services/Movies/Movies.API/Movies.API.csproj", "Services/Movies/Movies.API/"]
COPY ["Common/Auth/Auth.csproj", "Common/Auth/"]
COPY ["Services/Movies/Movies.Common/Movies.Common.csproj", "Services/Movies/Movies.Common/"]
RUN dotnet restore "Services/Movies/Movies.API/Movies.API.csproj"
COPY . .
WORKDIR "/src/Services/Movies/Movies.API"
RUN dotnet build "Movies.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Movies.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Movies.API.dll"]
