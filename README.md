# PUT3

## 🚧 Development
### Requirements
- Node.js (v18.0.0 or higher)
- pnpm (v9.12.0 or higher)
  
### Installation
1. Clone the repository
2. Run `pnpm install` in the root directory
3. Go to the `server` directory and copy the `.env.example` file to `.env`
4. Fill in the `.env` file with the required values
5. Run `pnpm run dev` in the root directory

### PowerShell to exe (requires admin rights)
Install-Module -Name ps2exe -RequiredVersion 1.0.11

### Production
docker build . --target client -t harryonbreadboard/put3-client --no-cache
docker build . --target server -t harryonbreadboard/put3-server --no-cache
docker tag harryonbreadboard/put3-client:latest harryonbreadboard/put3-client:1.0.0
docker tag harryonbreadboard/put3-server:latest harryonbreadboard/put3-server:1.0.0

## Install OPEN SSL
https://thesecmaster.com/procedure-to-install-openssl-on-the-windows-platform/
## Generate SSL Certificates
cd ssl
openssl req -newkey rsa:2048 -x509 -nodes -keyout server.key -new -out server.crt -config config.cnf -sha256 -days 365
