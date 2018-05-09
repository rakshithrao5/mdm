#!/bin/sh
#(2 letter code) country name ex [UK]
country="IN"
#State or Province Name (full name) [Some-State]
state="Karnataka"
#Locality Name (eg, city)
city="Bangalore"
#Organization Name (eg, company) [Internet Widgits Pty Ltd]
org="MEEM Bangalore"
#Organizational Unit Name (eg, section)
unit="Dev Team"
#Common Name (e.g. server FQDN or YOUR name)
#1 Creating Certificate Authority (CA)
cName1="MDM Test CA"

#2 Creating the Web Server
cName2=""


#3 Creating the Web Server (comanpay name ) devices
cName3="MEEM devices"

#email address
email="barath@meemmemory.com"




# echo "Enter password :"
# read -s password
# echo "Repeat password :"
# read -s rpassword
# echo $rpassword

# if [ "$password" != "$rpassword" ]; 
#     then
#         echo "Password did not match try again"
#         exit -1
# fi




#echo ""
#echo "Setting up server.cnf."
#echo "Please enter the Hostname or IP address of your server."
#read IP
#sed -i -e "s/<SERVER_IP>/$IP/g" server.cnf
#echo "Done."
#echo ""
#cName2=$IP
#
#echo ""
#echo "Setting up certificates for MDM server testing!"
#echo ""
#echo "1. Creating Certificate Authority (CA)"
##echo " ** For 'Common Name' enter something like 'MDM Test CA'"
##echo " ** Create and a remember the PEM pass phrase for use later on"
#echo ""
#subject="/CN=$cName1/emailAddress=$email/C=$country/ST=$state/L=$city/O=$org/OU=$unit"
#openssl req -new -x509 -extensions v3_ca -keyout cakey.key -out cacert.crt -days 365 -subj "$subject"
#echo ""
#echo "2. Creating the Web Server private key and certificate request"
## echo " ** For 'Common Name' enter your server's IP address **"
#echo ""
#
#subject="/CN=$cName2/emailAddress=$email/C=$country/ST=$state/L=$city/O=$org/OU=$unit"
#openssl genrsa 2048 > server.key
#openssl req -new -key server.key -out server.csr -subj "$subject"
#
#echo ""
#echo "3. Signing the server key with the CA. You'll use the PEM pass phrase from step 1."
#echo ""
#openssl x509 -req -days 365 -in server.csr -CA cacert.crt -CAkey cakey.key -CAcreateserial -out server.crt -extfile ./server.cnf -extensions ssl_server 



echo ""
echo "4. Creating the device Identity key and certificate request"
# echo " ** For 'Common Name' enter something like 'my device'"
echo ""
subject="/CN=$cName3/emailAddress=$email/C=$country/ST=$state/L=$city/O=$org/OU=$unit"
openssl genrsa 2048 > identity.key
openssl req -new -key identity.key -out identity.csr  -subj "$subject"

echo ""
echo "5. Signing the identity key with the CA. You'll the PEM pass phrase from step 1."
echo " ** Create an export passphrase. You'll need to include it in the IPCU profile."
echo ""
openssl x509 -req -days 365 -in identity.csr -CA cacert.crt -CAkey cakey.key -CAcreateserial -out identity.crt 
openssl pkcs12 -export -out identity.p12 -inkey identity.key -in identity.crt -certfile cacert.crt



#echo ""
#echo "6. Copying keys and certs to server folder"
## Move relevant certs to the /server/ directory
#mv server.key ../ssl/Server.key
#mv server.crt ../ssl/Server.crt
#mv cacert.crt ../ssl/CA.crt
mv identity.crt ../ssl/identity.crt
cp identity.p12 ../identity/identity.p12

#######################################
# Removed with softhinker vendor code #
#######################################

#echo "7. Generating keys and certs for plist generation"
#echo ""
#openssl req -inform pem -outform der -in identity.csr -out customer.der
# Rename identity.csr to be used with the iOS Provisioning Portal
#mv identity.csr customer.csr

#echo ""
#echo "8. Getting Apple certificates online"
#curl https://developer.apple.com/certificationauthority/AppleWWDRCA.cer -ko AppleWWDRCA.cer
#curl http://www.apple.com/appleca/AppleIncRootCertificate.cer -o AppleIncRootCertificate.cer
#openssl x509 -inform der -in AppleWWDRCA.cer -out intermediate.pem
#openssl x509 -inform der -in AppleIncRootCertificate.cer -out root.pem

# Move relevant files for use in softhinker vendor-signing
# Need to manually generate and move mdm.pem
#mv intermediate.pem ../vendor-signing/com/softhinker/intermediate.pem
#mv root.pem ../vendor-signing/com/softhinker/root.pem
#mv identity.p12 ../vendor-signing/com/softhinker/vendor.p12
#mv customer.der ../vendor-signing/com/softhinker/customer.der
