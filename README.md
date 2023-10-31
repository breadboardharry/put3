### PowerShell to exe (requires admin rights)
Install-Module -Name ps2exe -RequiredVersion 1.0.11

docker build . -t put3/frontend --no-cache
docker build . -t put3/backend --no-cache
docker tag put3/frontend:latest put3/frontend:2.0
docker tag put3/backend:latest put3/backend:2.0

## Install OPEN SSL
https://thesecmaster.com/procedure-to-install-openssl-on-the-windows-platform/
## Generate SSL Certificates
cd ssl
openssl req -newkey rsa:2048 -x509 -nodes -keyout server.key -new -out server.crt -config config.cnf -sha256 -days 365
