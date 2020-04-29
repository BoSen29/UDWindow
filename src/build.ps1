$BuildFolder = $PSScriptRoot

$powerShellGet = Import-Module PowerShellGet  -PassThru -ErrorAction Ignore
if ($powerShellGet.Version -lt ([Version]'1.6.0')) {
	Install-Module PowerShellGet -Scope CurrentUser -Force -AllowClobber
	Import-Module PowerShellGet -Force
}

Import-Module platyPS

Set-Location $BuildFolder

$OutputPath = "$BuildFolder\output\UniversalDashboard.UDWindow"

Remove-Item -Path $OutputPath -Force -ErrorAction SilentlyContinue -Recurse
Remove-Item -Path "$BuildFolder\public" -Force -ErrorAction SilentlyContinue -Recurse

New-Item -Path $OutputPath -ItemType Directory

npm install
npm run build

Copy-Item $BuildFolder\public\*.bundle.js $OutputPath
Copy-Item $BuildFolder\public\*.map $OutputPath
Copy-Item $BuildFolder\UniversalDashboard.UDWindow.psm1 $OutputPath
Copy-Item $BuildFolder\Scripts $OutputPath\Scripts -Recurse -Force

$Version = "1.0.0"

$manifestParameters = @{
	Path = "$OutputPath\UniversalDashboard.UDWindow.psd1"
	Author = "BoSen29, PsDevUK"
	CompanyName = "Ironman Software, LLC"
	Copyright = "2019 Ironman Software, LLC"
	RootModule = "UniversalDashboard.UDWindow.psm1"
	Description = ""
	ModuleVersion = $Version
	Tags = @("universaldashboard", "UD-Control")
	ReleaseNotes = "Initial release"
	FunctionsToExport = @(
		"New-UDWindow"
	)
}

New-ModuleManifest @manifestParameters

Import-Module ".\output\UniversalDashboard.UDWindow\UniversalDashboard.UDWindow.psm1"

#New-MarkdownHelp -Module UniversalDashboard.UDWindow -OutputFolder .\Help -Force
New-ExternalHelp .\Help -OutputPath .\output\UniversalDashboard.UDWindow\en-US\

Remove-Module UniversalDashboard.UDWindow