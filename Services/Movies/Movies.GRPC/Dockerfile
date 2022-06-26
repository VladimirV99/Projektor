#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Services/Movies/Movies.GRPC/Movies.GRPC.csproj", "Services/Movies/Movies.GRPC/"]
COPY ["Services/Movies/Movies.Common/Movies.Common.csproj", "Services/Movies/Movies.Common/"]
RUN dotnet restore "Services/Movies/Movies.GRPC/Movies.GRPC.csproj"
COPY . .
WORKDIR "/src/Services/Movies/Movies.GRPC"
RUN dotnet build "Movies.GRPC.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Movies.GRPC.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Movies.GRPC.dll"]
