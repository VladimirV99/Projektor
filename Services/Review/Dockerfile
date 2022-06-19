#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Services/Review/Review.csproj", "Services/Review/"]
COPY ["Common/Auth/Auth.csproj", "Common/Auth/"]
COPY ["Common/EventBus/EventBus.csproj", "Common/EventBus/"]
RUN dotnet restore "Services/Review/Review.csproj"
COPY . .
WORKDIR "/src/Services/Review"
RUN dotnet build "Review.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Review.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Review.dll"]