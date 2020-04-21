Import-Module UniversalDashboard
Import-Module "C:\dev\New-UDDrag\src\output\UniversalDashboard.UDDrag\UniversalDashboard.UDDrag.psm1"

Get-UDDashboard | Stop-UDDashboard

$dashboard = New-UDDashboard -Title "Dragbois" -Content {
    New-UDDrag -Id "DragQueen" -Title "Stuff to drag" -Content {
        New-UDImage -Url "https://raw.githubusercontent.com/psDevUK/UD-Drag/master/Capture.PNG"
    }
}

Start-UDDashboard -Dashboard $dashboard -Port 8083 -AutoReload