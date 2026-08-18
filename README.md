# Financial Manager

Aplicación para gestionar ingresos, gastos y categorías con dashboard.

## Inicio rápido

```bash
./start.sh
```

Abre: http://localhost:5173

## Tecnologías

- .NET 9 + ASP.NET Core
- Entity Framework Core + SQLite
- React + TypeScript + Vite
- Material UI

## Funcionalidades

- Dashboard con total de ingresos, gastos y balance
- CRUD de transacciones
- CRUD de categorías
- Vista de transacciones recientes

## API

- Backend: http://localhost:5050
- Swagger: http://localhost:5050/swagger

### Endpoints

#### Dashboard
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/dashboard` | Obtiene el resumen del dashboard con ingresos, gastos y balance |

#### Categorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/categories` | Obtiene todas las categorías |
| `GET` | `/api/categories/{id}` | Obtiene una categoría por ID |

#### Transacciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/transactions` | Obtiene todas las transacciones |
| `GET` | `/api/transactions/{id}` | Obtiene una transacción por ID |
| `POST` | `/api/transactions` | Crea una nueva transacción |
| `PUT` | `/api/transactions/{id}` | Actualiza una transacción |
| `DELETE` | `/api/transactions/{id}` | Elimina una transacción |

### Ejemplos de uso

```bash
# Obtener todas las categorías
curl http://localhost:5050/api/categories

# Obtener una categoría específica
curl http://localhost:5050/api/categories/1

# Obtener todas las transacciones
curl http://localhost:5050/api/transactions

# Crear una transacción
curl -X POST http://localhost:5050/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"description": "Compra", "amount": 100, "type": "expense", "categoryId": 1}'

# Actualizar una transacción
curl -X PUT http://localhost:5050/api/transactions/1 \
  -H "Content-Type: application/json" \
  -d '{"description": "Compra actualizada", "amount": 150, "type": "expense", "categoryId": 1}'

# Eliminar una transacción
curl -X DELETE http://localhost:5050/api/transactions/1

# Obtener datos del dashboard
curl http://localhost:5050/api/dashboard
```

## Estructura

```text
backend/FinancialManager.API
frontend/financial-manager-web
README.md
Dockerfile
docker-compose.yml
```
