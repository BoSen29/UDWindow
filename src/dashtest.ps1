Import-Module UniversalDashboard
Import-Module "C:\dev\New-UDDrag\src\output\UniversalDashboard.UDDrag\UniversalDashboard.UDDrag.psm1"

Get-UDDashboard | Stop-UDDashboard

$dashboard = New-UDDashboard -Title "Dragbois" -Content {
    New-UDButton -Text "Add more" -OnClick {
        Add-UDElement -ParentId "Addmore" -Content {
            New-UDDrag -Title "Stuff to drag" -minimizedSize 400 -Content {
                New-UDImage -Url "https://raw.githubusercontent.com/psDevUK/UD-Drag/master/Capture.PNG"
            } -x 500 -y -150        
        }
    }

    New-UDElement -Tag "div" -Id "Addmore" 
    New-UDDrag -Id "DragQueen" -Title "Stuff to drag" -minimizedSize 400 -Content {
        New-UDImage -Url "https://raw.githubusercontent.com/psDevUK/UD-Drag/master/Capture.PNG"
    } -x 500 -y -150 -onClose {
        Show-UDModal -Content {
            $parentId = $eventData
            New-UDHTML -markup "Are you sure you want to close 'Stuff to drag'?"
            New-UDButton -Text "Cancel" -OnClick {
                Hide-UDModal
            } -style @{"background-color" = "Green"}
            New-UDButton -Text "Confirm" -OnClick (New-UDEndpoint -Endpoint {
                Set-UDElement -Attributes @{hidden = $true} -Id $parentId
                Show-UDToast -Message $eventData
                #Show-UDToast -Message "Closed the window"
                Hide-UDModal
            } -Attribute @{"parentId" = $parentId} ) -style @{"background-color" = "Red"} 

        }
    }
}

Start-UDDashboard -Dashboard $dashboard -Port 8083 -AutoReload