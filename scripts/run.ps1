# Import the required assembly
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$defaultIpAdress = "localhost"  # Host ip adress


# ---------------------------------------------------------------------------- #
#                                  USER INPUTS                                 #
# ---------------------------------------------------------------------------- #

# Prompt the user for an IP address
$ipAddress = Read-Host "Enter IP address (default is $defaultIpAdress)"
if ([string]::IsNullOrWhiteSpace($ipAddress)) {
    $ipAddress = $defaultIpAdress
}

$dev = Read-Host "Dev? (Y/N)"
# Construct the URLs
if ($dev -eq "Y") {
    $appUrl = "http://${ipAddress}:4200/fool"
    $apiUrl = "http://${ipAddress}:3000/desktop/set"
}
else {
    $appUrl = "http://${ipAddress}/fool"
    $apiUrl = "http://${ipAddress}/api/desktop/set"
}

# Prompt the user for keeping the volume loop
$volumeLoopIn = Read-Host "Do you want to loop? (Y/N)"
$volumeLoop = $false
if ($volumeLoopIn -eq "Y") {
    $volumeLoop = $true
}


# ---------------------------------------------------------------------------- #
#                              DESKTOP SCREENSHOT                              #
# ---------------------------------------------------------------------------- #

& ".\modules\wallpaper.ps1" -postUrl $apiUrl


# ---------------------------------------------------------------------------- #
#                          OPEN APP IN DEFAULT BROWSER                         #
# ---------------------------------------------------------------------------- #

& ".\modules\open.ps1" -url $appUrl


# ---------------------------------------------------------------------------- #
#                             AUDIO VOLUME CONTROL                             #
# ---------------------------------------------------------------------------- #

& ".\modules\volume.ps1" -loop $volumeLoop

# ---------------------------------------------------------------------------- #

Write-Output "[*] OK! Leaving..."

# Wait before leaving the script
# (must be disabled in production)
Start-Sleep -Seconds 10
