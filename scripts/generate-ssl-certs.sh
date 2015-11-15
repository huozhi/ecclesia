#!/bin/bash

if [ ! -e server.js -a ! -e app.js ]
then
	echo "Error: could not find main application server.js file"
	echo "You should run the generate-ssl-certs.sh script from the main application root directory"
	echo "i.e: bash scripts/generate-ssl-certs.sh"
	exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ./sslcert
openssl genrsa -out ./sslcert/key.pem 1024
openssl req -new -key ./sslcert/key.pem -out ./sslcert/csr.pem
openssl x509 -req -days 9999 -in ./sslcert/csr.pem -signkey ./sslcert/key.pem -out ./sslcert/cert.pem
rm ./sslcert/csr.pem
chmod 600 ./sslcert/key.pem ./sslcert/cert.pem
