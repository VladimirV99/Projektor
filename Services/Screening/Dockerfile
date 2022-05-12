#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Services/Screening/Screening.csproj", "Services/Screening/"]
COPY ["Common/Auth/Auth.csproj", "Common/Auth/"]
RUN dotnet restore "Services/Screening/Screening.csproj"
COPY . .
WORKDIR "/src/Services/Screening"
RUN dotnet build "Screening.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Screening.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Screening.dll"]
