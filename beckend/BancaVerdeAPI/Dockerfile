FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["BancaVerdeAPI.csproj", "./"]
RUN dotnet restore "BancaVerdeAPI.csproj"

COPY . .
RUN dotnet publish "BancaVerdeAPI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "BancaVerdeAPI.dll"]