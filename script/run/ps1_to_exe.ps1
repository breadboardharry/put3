$filename = Read-Host "Script to convert: "
Invoke-ps2exe ".\$filename.ps1" ".\$filename.exe"
Write-Host "Opération terminée"
Start-Sleep -Seconds 1
