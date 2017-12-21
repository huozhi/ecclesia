#!/bin/bash

if [ ! -e server.js -a ! -e app.js ]
then
	echo "Error: could not find main application server.js file"
	echo "You should run the generate-ssl-certs.sh script from the main application root directory"
	echo "i.e: bash scripts/generate-ssl-certs.sh"
	exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ./server/sslcert
cd ./server/sslcert
openssl genrsa -out ./key.pem 1024
openssl req -new -key ./key.pem -out ./csr.pem
openssl x509 -req -days 9999 -in ./csr.pem -signkey ./key.pem -out ./cert.pem
rm ./csr.pem
chmod 600 ./key.pem ./cert.pem
cd ../..
