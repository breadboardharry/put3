Copy-Item -Path ".\put3" -Destination "C:" -Recurse
(New-Object -ComObject Shell.Application).ToggleDesktop()
Start-Sleep -Seconds 1


[Reflection.Assembly]::LoadWithPartialName("System.Drawing")
function screenshot([Drawing.Rectangle]$bounds, $path) {
   $bmp = New-Object Drawing.Bitmap $bounds.width, $bounds.height
   $graphics = [Drawing.Graphics]::FromImage($bmp)

   $graphics.CopyFromScreen($bounds.Location, [Drawing.Point]::Empty, $bounds.size)

   $bmp.Save($path)

   $graphics.Dispose()
   $bmp.Dispose()
}

$bounds = [Drawing.Rectangle]::FromLTRB(0, 0, 1920, 1080)
screenshot $bounds "C:\put3\assets\images\desktop.png"


Write-Output "Screenshot saved to:"
Write-Output $path

# Libération des ressources
$graphics.Dispose()
$bitmap.Dispose()

Start-Process -FilePath "C:\put3\run.html"
Add-Type -AssemblyName System.Windows.Forms
Start-Sleep -Seconds 2  # Attendre que la page soit chargée
# $webBrowser.Focus()
[System.Windows.Forms.SendKeys]::SendWait("{F11}")
