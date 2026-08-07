@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "URL=http://localhost:8080"
set "PORT=8080"

echo.
echo  成凯丽简历 - 本地预览
echo  地址: %URL%
echo.

netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo  开发服务已在运行，直接打开浏览器...
  start "" "%URL%"
  exit /b 0
)

echo  正在启动开发服务...
start "Resume Dev Server (8080)" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo  等待服务就绪...
timeout /t 10 /nobreak >nul

start "" "%URL%"
echo  已打开 %URL%
echo  关闭标题为 "Resume Dev Server (8080)" 的窗口即可停止服务。
echo.
