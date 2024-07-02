FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["report-worker.csproj", "./"]
RUN dotnet restore "report-worker.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "report-worker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "report-worker.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "report-worker.dll"]
