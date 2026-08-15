#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}   Financial Manager - Startup${NC}"
echo -e "${BLUE}==================================${NC}\n"

# Check if .NET SDK is installed
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}Error: .NET SDK no está instalado${NC}"
    echo "Descárgalo desde: https://dotnet.microsoft.com/download"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js no está instalado${NC}"
    echo "Descárgalo desde: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}Dependencias del sistema verificadas${NC}\n"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/backend/FinancialManager.API"
FRONTEND_DIR="$SCRIPT_DIR/frontend/financial-manager-web"

cleanup_stale_processes() {
    for port in 5050 5173; do
        local stale_pids
        stale_pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"

        if [ -n "$stale_pids" ]; then
            echo -e "${YELLOW}Liberando procesos previos en puerto ${port}...${NC}"
            kill $stale_pids 2>/dev/null || true
            sleep 1
        fi
    done
}

cleanup_stale_processes

# Function to print section
print_section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Backend setup
print_section "Configurando Backend"

cd "$BACKEND_DIR" || exit 1

# Check if database exists
if [ ! -f "financial-manager.db" ]; then
    echo -e "${YELLOW}Creando base de datos...${NC}"
    dotnet ef database update > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Base de datos creada${NC}"
    else
        echo -e "${YELLOW}ℹ Nota: Asegúrate de que las migraciones estén aplicadas${NC}"
    fi
else
    echo -e "${GREEN}Base de datos ya existe${NC}"
fi

echo -e "${GREEN}Backend listo${NC}"

# Frontend setup
print_section "Configurando Frontend"

cd "$FRONTEND_DIR" || exit 1

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias...${NC}"
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✓ Dependencias instaladas${NC}"
else
    echo -e "${GREEN}✓ Dependencias ya están instaladas${NC}"
fi

# Starting servers
print_section "Iniciando servidores"

# Change back to script directory for running commands
cd "$SCRIPT_DIR" || exit 1

echo -e "${YELLOW}Backend:${NC}  http://localhost:5050"
echo -e "${YELLOW}Frontend:${NC} http://localhost:5173"
echo -e "${YELLOW}Swagger:${NC}  http://localhost:5050/swagger\n"

# Start backend in background
echo -e "${BLUE}Iniciando Backend...${NC}"
cd "$BACKEND_DIR"
dotnet run --urls "http://0.0.0.0:5050" > /tmp/financial_manager_backend.log 2>&1 &
BACKEND_PID=$!

# Wait until backend is ready to accept requests before starting frontend
for i in {1..30}; do
    if curl -fsS "http://localhost:5050/api/dashboard" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Start frontend
echo -e "${BLUE}Iniciando Frontend...${NC}"
cd "$FRONTEND_DIR"
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo -e "\n${GREEN}Ambos servidores iniciados${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}\n"

# Function to handle interrupt
cleanup() {
    echo -e "\n${YELLOW}Deteniendo servidores...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Servidores detenidos${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
