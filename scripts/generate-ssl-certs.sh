#!/bin/bash

if [ ! -e server.js ]
then
	echo "Error: could not find main application server.js file"
	echo "You should run the generate-ssl-certs.sh script from the main application root directory"
	echo "i.e: bash scripts/generate-ssl-certs.sh"
	exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ./sslcerts
openssl genrsa -out ./sslcerts/key.pem 1024
openssl req -new -key ./sslcerts/key.pem -out ./sslcerts/csr.pem
openssl x509 -req -days 9999 -in ./sslcerts/csr.pem -signkey ./sslcerts/key.pem -out ./sslcerts/cert.pem
rm ./sslcerts/csr.pem
chmod 600 ./sslcerts/key.pem ./sslcerts/cert.pem
