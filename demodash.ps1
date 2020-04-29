Import-Module UniversalDashboard
Import-Module "C:\dev\New-UDDrag\src\output\UniversalDashboard.UDWindow\UniversalDashboard.UDWindow.psm1"

Get-UDDashboard | Stop-UDDashboard

$dashboard = New-UDDashboard -Title "Dragbois" -Content {

    #Add more UDWindows to the screen to test the stacking.
    New-UDButton -Text "Add more" -OnClick {
        Add-UDElement -ParentId "Addmore" -Content {
            New-UDWindow -Title "Stuff to drag$(get-random)" -minimizedSize 400 -Content {
                New-UDHtml -Markup "<p>$(get-random)</p>"
            } -x 500 -y -150        
        }
    }

    #Supports set-udelement
    New-UDButton -Text "Hide" -OnClick {
        Set-UDElement -Attributes @{
            hidden = $true
        } -Id "DragQueen"
    }

    #Supports remove-udelement
    New-UDButton -Text "Hide #2" -OnClick {
        Remove-UDElement -Id "DragQueen"
    }

    #Reopen a hidden / removed window
    New-UDButton -Text "Open" -OnClick {
        Set-UDElement -Attributes @{
            hidden = $false
        } -Id "DragQueen"
    }

    #Supports custom handling of closing.
    New-UDWindow -Id "DragQueen" -Title "Stuff to drag" -minimizedSize 400 -Content {
        New-UDHtml -Markup "<p>$(get-random)</p>"
    } -x 500 -y -150 -onClose {
        Show-UDModal -Content {
            $parentId = $eventData
            New-UDHTML -markup "Are you sure you want to close 'Stuff to drag'?"
            New-UDButton -Text "Cancel" -OnClick {
                Hide-UDModal
            } -style @{"background-color" = "Green"}
            New-UDButton -Text "Confirm" -OnClick (New-UDEndpoint -Endpoint {
                Remove-UDElement -Id $parentID
                Hide-UDModal
            }) -style @{"background-color" = "Red"} 

        }
    }

    New-UDElement -Tag "div" -Id "Addmore" 
}

Start-UDDashboard -Dashboard $dashboard -Port 8083 -AutoReload
