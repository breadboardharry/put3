param(
    [string]$url = ""
)

# ------------------------------- Dependencies ------------------------------- #

Add-Type -AssemblyName System.Windows.Forms


# ---------------------------------------------------------------------------- #
#                                    INPUTS                                    #
# ---------------------------------------------------------------------------- #

# If no route is provided, prompt the user for an IP address
if ([string]::IsNullOrWhiteSpace($url)) {
    # Get IP address
    $ipAddress = Read-Host "Enter IP address (default is localhost)"

    # If no IP provided, use localhost
    if ([string]::IsNullOrWhiteSpace($ipAddress)) {
        $ipAddress = "localhost"
    }

    # Ask the user if they are using the dev server
    $dev = Read-Host "Dev? (Y/N)"

    # Construct the URLs
    if ($dev -eq "Y") {
        $url = "http://${ipAddress}:4200/fool"
    }
    else {
        $url = "http://${ipAddress}/fool"
    }
}

# ---------------------------------------------------------------------------- #
#                          OPEN APP IN DEFAULT BROWSER                         #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Open application in default browser"

# Open the URL in the default web browser
Start-Process $url

# Wait for the page to load
Start-Sleep -Seconds 3

# Send the F11 key to enter full-screen mode
[System.Windows.Forms.SendKeys]::SendWait("{F11}")


# ---------------------------------------------------------------------------- #

Write-Output "[*] OK! Leaving..."

# Wait before leaving the script
# (must be disabled in production)
Start-Sleep -Seconds 1
