# Prompt the user for the name of the USB key to copy to
$usbKey = Read-Host "Enter the name of the USB key to copy to (e.g. 'E:')"

# Check if the USB key exists
if (Test-Path $usbKey) {
  # Prompt the user for the name of the directory to copy
  $app = "./../dist/put3"
  $script = "./run/hello.exe"

  # Check if the directory exists
  if (Test-Path $app -PathType Container) {
    # Copy the directory to the USB key
    Copy-Item -Path $app -Destination $usbKey -Recurse -Force

    # Notify the user that the copy was successful
    Write-Host "Directory copied successfully to $usbKey"
  }
  else {
    # Notify the user that the directory doesn't exist
    Write-Host "The directory $app doesn't exist"
    # Wait for user input before closing the script
    Read-Host "Press any key to exit..."
  }

  # Check if the directory exists
  if (Test-Path $script -PathType Leaf) {
    # Copy the directory to the USB key
    Copy-Item -Path $script -Destination $usbKey -Recurse -Force

    # Notify the user that the copy was successful
    Write-Host "Directory copied successfully to $usbKey"
  }
  else {
    # Notify the user that the directory doesn't exist
    Write-Host "The directory $script doesn't exist"
    # Wait for user input before closing the script
    Read-Host "Press any key to exit..."
  }
}
else {
  # Notify the user that the USB key doesn't exist
  Write-Host "The USB key $usbKey doesn't exist"
  # Wait for user input before closing the script
  Read-Host "Press any key to exit..."
}
