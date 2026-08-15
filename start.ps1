# Financial Manager - PowerShell Startup Script
# Para Windows con PowerShell

# Colores para output
$ErrorColor = "Red"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$InfoColor = "Cyan"

Write-Host ""
Write-Host "===================================" -ForegroundColor $InfoColor
Write-Host "   Financial Manager - Startup" -ForegroundColor $InfoColor
Write-Host "===================================" -ForegroundColor $InfoColor
Write-Host ""

# Verificar que .NET SDK esté instalado
Write-Host "Verificando dependencias del sistema..."
$dotnetCheck = dotnet --version 2>$null
if (-not $dotnetCheck) {
    Write-Host ".NET SDK no está instalado" -ForegroundColor $ErrorColor
    Write-Host "Descárgalo desde: https://dotnet.microsoft.com/download"
    exit 1
}

# Verificar que Node.js esté instalado
$nodeCheck = node --version 2>$null
if (-not $nodeCheck) {
    Write-Host "Node.js no está instalado" -ForegroundColor $ErrorColor
    Write-Host "Descárgalo desde: https://nodejs.org/"
    exit 1
}

Write-Host "Dependencias verificadas" -ForegroundColor $SuccessColor
Write-Host ""

# Obtener el directorio del script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $ScriptDir "backend\FinancialManager.API"
$FrontendDir = Join-Path $ScriptDir "frontend\financial-manager-web"

function Print-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
    Write-Host $Title -ForegroundColor $InfoColor
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
    Write-Host ""
}

# Configurar Backend
Print-Section "Configurando Backend"

Push-Location $BackendDir

# Verificar si la base de datos existe
$dbFile = Join-Path $BackendDir "financial-manager.db"
if (-not (Test-Path $dbFile)) {
    Write-Host "Creando base de datos..." -ForegroundColor $WarningColor
    dotnet ef database update | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Base de datos creada" -ForegroundColor $SuccessColor
    } else {
        Write-Host "ℹ Nota: Asegúrate de que las migraciones estén aplicadas" -ForegroundColor $WarningColor
    }
} else {
    Write-Host "✓ Base de datos ya existe" -ForegroundColor $SuccessColor
}

Write-Host "✓ Backend listo" -ForegroundColor $SuccessColor
Pop-Location

# Configurar Frontend
Print-Section "Configurando Frontend"

Push-Location $FrontendDir

$nodeModulesDir = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $nodeModulesDir)) {
    Write-Host "Instalando dependencias..." -ForegroundColor $WarningColor
    npm install | Out-Null
    Write-Host "✓ Dependencias instaladas" -ForegroundColor $SuccessColor
} else {
    Write-Host "✓ Dependencias ya están instaladas" -ForegroundColor $SuccessColor
}

Pop-Location

# Iniciar servidores
Print-Section "Iniciando servidores"

Write-Host "Backend:  http://localhost:5000 (o https://localhost:5001)" -ForegroundColor $WarningColor
Write-Host "Frontend: http://localhost:5173" -ForegroundColor $WarningColor
Write-Host "Swagger:  https://localhost:5001/swagger" -ForegroundColor $WarningColor
Write-Host ""

Write-Host "Iniciando Backend..." -ForegroundColor $InfoColor
Push-Location $BackendDir
$backendProcess = Start-Process -NoNewWindow -PassThru -FilePath "dotnet" -ArgumentList "run"
Pop-Location

# Dar tiempo al backend para iniciar
Start-Sleep -Seconds 3

Write-Host "Iniciando Frontend..." -ForegroundColor $InfoColor
Push-Location $FrontendDir
$frontendProcess = Start-Process -NoNewWindow -PassThru -FilePath "npm" -ArgumentList "run", "dev"
Pop-Location

Write-Host ""
Write-Host "Ambos servidores iniciados" -ForegroundColor $SuccessColor
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor $WarningColor
Write-Host ""

# Esperar a que se presione Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Deteniendo servidores..." -ForegroundColor $WarningColor
    Stop-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue
    Write-Host "Servidores detenidos" -ForegroundColor $SuccessColor
}
