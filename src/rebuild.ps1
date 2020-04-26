Get-UDDashboard | Stop-UDDashboard

Remove-Module UniversalDashboard.UDDrag -ErrorAction SilentlyContinue

& .\build.ps1

& .\dashtest.ps1