FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/financial-manager-web/package*.json ./
RUN npm install
COPY frontend/financial-manager-web/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /src
COPY backend/FinancialManager.API/FinancialManager.API.csproj ./backend/FinancialManager.API/
RUN dotnet restore ./backend/FinancialManager.API/FinancialManager.API.csproj
COPY backend/FinancialManager.API/. ./backend/FinancialManager.API/
RUN dotnet publish ./backend/FinancialManager.API/FinancialManager.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5050
COPY --from=backend-build /app/publish ./
EXPOSE 5050
ENTRYPOINT ["dotnet", "FinancialManager.API.dll"]
