# Development Configuration Guide

Esta guía te ayuda a configurar el proyecto con diferentes puertos y opciones de desarrollo.

## Cambiar Puertos

### Backend (.NET)

El backend usa los puertos por defecto definidos en `Properties/launchSettings.json`:

```json
{
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "http://localhost:5050",
      // ...
    }
  }
}
```

**Para cambiar el puerto del backend:**

```bash
cd backend/FinancialManager.API

# Usar puerto específico
dotnet run --urls "http://localhost:3000"
```

### Frontend (React)

Vite permite cambiar el puerto con una variable de entorno:

```bash
cd frontend/financial-manager-web

# Puerto 3000
VITE_PORT=3000 npm run dev

# O especificar el puerto en vite.config.ts
# server: { port: 3000 }
```

**Actualizar URL de la API en el frontend:**

Edita `frontend/financial-manager-web/src/services/api.ts`:

```typescript
const BASE_URL = process.env.VITE_API_URL || 'http://localhost:5050/api';
```

Luego ejecuta:
```bash
VITE_API_URL=http://localhost:3000/api npm run dev
```

---

## Variables de Entorno

### Backend (.NET)

El backend puede configurarse con variables de entorno. Edita `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=financial-manager.db"
  }
}
```

### Frontend (React)

Crea un archivo `.env.local` en `frontend/financial-manager-web/`:

```env
VITE_API_URL=http://localhost:5050/api
VITE_API_TIMEOUT=5000
VITE_ENV=development
```

Luego úsalos en el código:
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
```

---

## Base de Datos

### Cambiar la Base de Datos

Por defecto usa SQLite local. Para usar una base de datos diferente:

1. **PostgreSQL o SQL Server:** Cambiar la cadena de conexión en `appsettings.json`
2. **Entity Framework:** El DbContext ya está configurado en `Data/AppDbContext.cs`

Actualizar la cadena de conexión:
```bash
cd backend/FinancialManager.API
dotnet ef database update
```

### Crear una Nueva Migración

Después de cambiar modelos (Models):

```bash
cd backend/FinancialManager.API
dotnet ef migrations add "DescripcionDelCambio"
dotnet ef database update
```

---

## CORS en Desarrollo

El backend está configurado para permitir todos los orígenes en desarrollo.

**En `Program.cs`:**
```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});
```

**En producción**, especifica el origen exacto:
```csharp
builder.WithOrigins("https://tudominio.com")
       .AllowAnyMethod()
       .AllowAnyHeader();
```

---

## Debug y Desarrollo

### Backend Debug

Con Visual Studio o Visual Studio Code:
1. Abre `backend/FinancialManager.API/Program.cs`
2. Presiona `F5` o click en "Start Debugging"

O desde terminal:
```bash
cd backend/FinancialManager.API
dotnet run --configuration Debug
```

### Frontend Debug

El navegador tiene React DevTools instaladas automáticamente con Vite:

1. Abre la consola del navegador: `F12`
2. Tab: `Components`
3. Inspecciona componentes React

### Hot Module Replacement (HMR)

Ambos proyectos soportan recarga automática:

- **Backend (.NET):** `dotnet watch run`
- **Frontend (Vite):** `npm run dev` (habilitado por defecto)

---

## Swagger/OpenAPI

Accede a la documentación interactiva de la API:

**URL:** `http://localhost:5050/swagger`

Aquí puedes probar todos los endpoints sin necesidad del frontend.

---

## Testing

### Backend

```bash
cd backend/FinancialManager.API
cd ../FinancialManager.Tests
dotnet test
```

### Frontend

```bash
cd frontend/financial-manager-web
npm test  # Si está configurado
```

---

## Build para Producción

### Backend

```bash
cd backend/FinancialManager.API
dotnet build -c Release
```

Salida en: `bin/Release/net9.0/`

### Frontend

```bash
cd frontend/financial-manager-web
npm run build
```

Salida en: `dist/`

---

## Troubleshooting

**Puerto ya en uso:**
```bash
# macOS/Linux
lsof -i :5000

# Windows
netstat -ano | findstr :5000
```

**npm install falla:**
```bash
cd frontend/financial-manager-web
rm -rf node_modules package-lock.json
npm install
```

**Base de datos corrupta:**
```bash
cd backend/FinancialManager.API
rm financial-manager.db
dotnet ef database update
```

**CORS error:**
- Verifica que el frontend está en `http://localhost:5173`
- El backend debe estar en `http://localhost:5050`
- Ambos deben estar ejecutándose

---

¿Preguntas? Revisa la [guía de startup](./STARTUP.md) o el [README principal](./README.md).
