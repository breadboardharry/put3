### PowerShell to exe (requires admin rights)
Install-Module -Name ps2exe -RequiredVersion 1.0.11

docker build . -t put3/frontend
docker build . -t put3/backend
docker tag put3/frontend:latest put3/frontend:0.1
docker tag put3/backend:latest put3/backend:0.1
