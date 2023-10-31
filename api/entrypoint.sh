#!/bin/sh

node <<EOF
const fs = require("fs");
const template = JSON.parse(fs.readFileSync("/usr/src/app/firebase-adminsdk-auth-key.template.json", "utf8"));
template.project_id = process.env.FIREBASE_PROJECT_ID;
template.private_key_id = process.env.FIREBASE_PRIVATE_KEY_ID;
template.private_key = process.env.FIREBASE_PRIVATE_KEY;
template.client_email = process.env.FIREBASE_CLIENT_EMAIL;
template.client_id = process.env.FIREBASE_CLIENT_ID;
template.client_x509_cert_url = process.env.FIREBASE_CLIENT_X509_CERT_URL;
fs.writeFileSync("/usr/src/app/firebase-adminsdk-auth-key.json", JSON.stringify(template, null, 4));
EOF

cat /usr/src/app/firebase-adminsdk-auth-key.json

# Execute CMD from Dockerfile
exec "$@"
