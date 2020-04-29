Get-UDDashboard | Stop-UDDashboard

Remove-Module UniversalDashboard.UDWindow -ErrorAction SilentlyContinue

& .\build.ps1

& .\demodash.ps1
