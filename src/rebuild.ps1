Get-UDDashboard | Stop-UDDashboard

Remove-Module UniversalDashboard.UDWindow -ErrorAction SilentlyContinue

& .\src\build.ps1

& .\dashtest.ps1