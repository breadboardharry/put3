param(
    [string]$postUrl = ""
)

# ------------------------------- Dependencies ------------------------------- #

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing


# ---------------------------------------------------------------------------- #
#                                    INPUTS                                    #
# ---------------------------------------------------------------------------- #

# If no route is provided, prompt the user for an IP address
if ([string]::IsNullOrWhiteSpace($postUrl)) {
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
        $postUrl = "http://${ipAddress}:3000/desktop/set"
    }
    else {
        $postUrl = "http://${ipAddress}/api/desktop/set"
    }
}

# ---------------------------------------------------------------------------- #
#                              DESKTOP SCREENSHOT                              #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Take a screenshot of user desktop"

# Back to desktop
(New-Object -ComObject Shell.Application).ToggleDesktop()
Start-Sleep -Seconds 1

# Create a bitmap of the user's desktop
$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)

# Convert bitmap to base64 string
$imageStream = New-Object System.IO.MemoryStream
$bitmap.Save($imageStream, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$imageBytes = $imageStream.ToArray()
$imageBase64 = [System.Convert]::ToBase64String($imageBytes)

# Free resources
$graphics.Dispose()
$bitmap.Dispose()


# ---------------------------------------------------------------------------- #
#                              POST THE SCREENSHOT                             #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Post the screenshot to ${postUrl}"

# Post the file to the specified route
$body = @{ image = $imageBase64 } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $postUrl -Method Post -Body $body -ContentType "application/json"

# Check if the post was successful
if ($response.message -eq "Image uploaded successfully") {
    Write-Output " - Screenshot successfully uploaded"
}
else {
    Write-Output "[!] Error uploading screenshot: $($response.message)"
    Start-Sleep -Seconds 4
    exit
}
