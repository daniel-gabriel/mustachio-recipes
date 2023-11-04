#!/bin/sh


node <<EOF
const fs = require("fs");
const template = JSON.parse(fs.readFileSync("/usr/src/app/firebase-adminsdk-auth-key.template.json", "utf8"));
template.project_id = "~FIREBASE_PROJECT_ID~";
template.private_key_id = "~FIREBASE_PRIVATE_KEY_ID~";
template.private_key = "~FIREBASE_PRIVATE_KEY~";
template.client_email = "~FIREBASE_CLIENT_EMAIL~";
template.client_id = "~FIREBASE_CLIENT_ID~";
template.client_x509_cert_url = "~FIREBASE_CLIENT_X509_CERT_URL~";

const finalContents = JSON.stringify(template, null, 4)
    .replace("~FIREBASE_PROJECT_ID~", process.env.FIREBASE_PROJECT_ID)
    .replace("~FIREBASE_PRIVATE_KEY_ID~", process.env.FIREBASE_PRIVATE_KEY_ID)
    .replace("~FIREBASE_PRIVATE_KEY~", process.env.FIREBASE_PRIVATE_KEY)
    .replace("~FIREBASE_CLIENT_EMAIL~", process.env.FIREBASE_CLIENT_EMAIL)
    .replace("~FIREBASE_CLIENT_ID~", process.env.FIREBASE_CLIENT_ID)
    .replace("~FIREBASE_CLIENT_X509_CERT_URL~", process.env.FIREBASE_CLIENT_X509_CERT_URL);

fs.writeFileSync("/usr/src/app/firebase-adminsdk-auth-key.json", finalContents);
EOF

cat /usr/src/app/firebase-adminsdk-auth-key.json

# Execute CMD from Dockerfile
exec "$@"
