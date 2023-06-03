### PowerShell to exe (requires admin rights)
Install-Module -Name ps2exe -RequiredVersion 1.0.11

docker build . -t put3/frontend
docker build . -t put3/backend
docker tag put3/frontend:latest put3/frontend:0.1
docker tag put3/backend:latest put3/backend:0.1

## Install OPEN SSL
https://thesecmaster.com/procedure-to-install-openssl-on-the-windows-platform/
## Generate SSL Certificates
cd ssl
openssl req -newkey rsa:2048 -x509 -nodes -keyout server.key -new -out server.crt -config config.cnf -sha256 -days 365
