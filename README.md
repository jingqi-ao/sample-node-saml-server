# Sample server for node-saml

## Idp side configuration
We use Okta as a test identity provider (Idp)

Create an application with following minimal settings:

### General
- Sign Sign On URL: http://localhost:3000/saml/login/callback
- Recipient URL: http://localhost:3000/saml/login/callback
- Destination URL: http://localhost:3000/saml/login/callback
- Audience Restriction: demo-node-saml-server
- Name ID Format: Unspecified
- Assertion Signature: Signed
- Signature Algorithm: RSA_SHA256
- Digest Algorithm: SHA256
- Assertion Encryption: Unencrypted

### Attribute Statements
- Name: email, Name Format: Unspecified, Value: user.email

## Sample server side change
Sample server needs to set up following configurations:
- callbackUrl: http://localhost:3000/saml/login/callback
- audience: 'demo-node-saml-server'. This value is consistent with the "Audience Restriction" in Idp General settings
- signatureAlgorithm: 'sha256'. This value is consistent with the "Signature Algorithm" in Idp General settings


## How to run sample server

```bash

npm install

npm run main.js

```

## How to see the demo
- Use a browser to access url: http://localhost:3000/saml/login
If user has not authenticated with Okta, user's agent (browser) will be redirected to Okta to finish SSO (Single Sign On).
- Then user's agent will be redirected back to the Demo Server Recipient URL, i.e. http://localhost:3000/saml/login/callback.
A simple message will be shown in the browser "hello <user-email>" (e.g. "hello user@example.com"). <user-email> is obtained from SSO (SAML response).
